/* eslint-disable max-len */
import * as functions from "firebase-functions";
import {getStorage} from "firebase-admin/storage";
import {getFirestore, FieldValue} from "firebase-admin/firestore";
import {initializeApp} from "firebase-admin/app";
import {z} from "zod";

// Initialize Firebase Admin
initializeApp();

const storage = getStorage();
const db = getFirestore();

// Helper function to create a slug from a title
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// Validation schema
const postDataSchema = z.object({
  title: z.string().min(2).max(150),
  excerpt: z.string().min(10).max(300),
  content: z.string().min(20),
  status: z.enum(["draft", "published"]),
  category: z.string().min(1),
  newCategory: z.string().optional(),
});

const requestSchema = z.object({
  postData: postDataSchema,
  imageData: z.string().optional(),
  imageName: z.string().optional(),
  imageType: z.string().optional(),
  postId: z.string().optional(),
});

export const createOrUpdatePost = functions.https.onCall(async (data, context) => {
  try {
    // Check authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Debes estar autenticado para realizar esta operación."
      );
    }

    // Validate input data
    const validationResult = requestSchema.safeParse(data);
    if (!validationResult.success) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Datos de entrada inválidos.",
        validationResult.error.errors
      );
    }

    const {postData, imageData, imageName, imageType, postId} = validationResult.data;
    const userId = context.auth.uid;

    // Start transaction
    return await db.runTransaction(async (transaction) => {
      let finalCategory = postData.category;
      let imageUrl = "";

      // Step 1: Handle category creation if needed
      if (postData.category === "new_category" && postData.newCategory) {
        const trimmedNewCategory = postData.newCategory.trim();
        if (trimmedNewCategory.length < 2) {
          throw new functions.https.HttpsError(
            "invalid-argument",
            "El nombre de la nueva categoría debe tener al menos 2 caracteres."
          );
        }

        const categorySlug = createSlug(trimmedNewCategory);
        const categoryRef = db.collection("categories").doc(categorySlug);

        // Check if category already exists
        const categoryDoc = await transaction.get(categoryRef);
        if (!categoryDoc.exists) {
          transaction.set(categoryRef, {
            name: trimmedNewCategory,
            slug: categorySlug,
            createdAt: FieldValue.serverTimestamp(),
          });
        }
        finalCategory = trimmedNewCategory;
      }

      // Step 2: Handle image upload if provided
      if (imageData && imageName && imageType) {
        // If updating post, delete old image first
        if (postId) {
          const existingPostRef = db.collection("posts").doc(postId);
          const existingPost = await transaction.get(existingPostRef);
          if (existingPost.exists && existingPost.data()?.featuredImageUrl) {
            const oldImagePath = existingPost.data()?.featuredImageUrl;
            try {
              // Extract path from URL and delete
              const bucket = storage.bucket();
              const pathMatch = oldImagePath.match(/\/o\/(.+?)\?/);
              if (pathMatch) {
                const decodedPath = decodeURIComponent(pathMatch[1]);
                await bucket.file(decodedPath).delete();
              }
            } catch (error) {
              console.warn("Could not delete old image:", error);
            }
          }
        }

        // Upload new image
        const bucket = storage.bucket();
        const fileName = `posts/${Date.now()}_${imageName}`;
        const file = bucket.file(fileName);

        // Convert base64 to buffer
        const imageBuffer = Buffer.from(imageData, "base64");

        // Upload file
        await file.save(imageBuffer, {
          metadata: {
            contentType: imageType,
          },
        });

        // Make file publicly accessible
        await file.makePublic();

        // Get public URL
        imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      }

      // Step 3: Create or update post document
      const slug = createSlug(postData.title);
      const now = FieldValue.serverTimestamp();

      interface PostDocData {
        title: string;
        slug: string;
        excerpt: string;
        content: string;
        status: string;
        categories: string[];
        updatedAt: FirebaseFirestore.FieldValue;
        authorId: string;
        featuredImageUrl?: string;
      }

      const postDocData: PostDocData = {
        title: postData.title,
        slug,
        excerpt: postData.excerpt,
        content: postData.content,
        status: postData.status,
        categories: [finalCategory],
        updatedAt: now,
        authorId: userId,
      };

      if (imageUrl) {
        postDocData.featuredImageUrl = imageUrl;
      }

      if (postId) {
        // Update existing post
        const postRef = db.collection("posts").doc(postId);
        const existingPostDoc = await transaction.get(postRef);

        if (!existingPostDoc.exists) {
          throw new functions.https.HttpsError(
            "not-found",
            "La publicación que intentas actualizar no existe."
          );
        }

        // Check if user owns the post
        if (existingPostDoc.data()?.authorId !== userId) {
          throw new functions.https.HttpsError(
            "permission-denied",
            "No tienes permisos para actualizar esta publicación."
          );
        }

        transaction.update(postRef, {...postDocData});

        return {
          success: true,
          postId,
          message: "Publicación actualizada correctamente.",
        };
      } else {
        // Create new post
        const newPostRef = db.collection("posts").doc();
        const createData = {
          ...postDocData,
          viewsCount: 0,
          likesCount: 0,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        };

        if (!imageUrl) {
          throw new functions.https.HttpsError(
            "invalid-argument",
            "La imagen destacada es requerida para crear una nueva publicación."
          );
        }

        transaction.set(newPostRef, createData);

        return {
          success: true,
          postId: newPostRef.id,
          message: "Publicación creada correctamente.",
        };
      }
    });
  } catch (error) {
    functions.logger.error("Error in createOrUpdatePost function:", error);

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      "internal",
      "Error interno del servidor al procesar la publicación."
    );
  }
});

// Función para subir archivos y crear estudio
export const createStudyWithFiles = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Usuario no autenticado");
  }

  try {
    const {
      title,
      description,
      category,
      author,
      publishDate,
      tags,
      featured,
      pdfFile,
      thumbnailFile,
    } = data;

    let pdfUrl = "";
    let thumbnailUrl = "";

    // Subir PDF si existe
    if (pdfFile) {
      const pdfBuffer = Buffer.from(pdfFile.data, "base64");
      const pdfFileName = `studies/pdfs/${Date.now()}_${pdfFile.name}`;
      const pdfFileRef = storage.bucket().file(pdfFileName);

      await pdfFileRef.save(pdfBuffer, {
        metadata: {
          contentType: pdfFile.type,
        },
      });

      await pdfFileRef.makePublic();
      pdfUrl = `https://storage.googleapis.com/${storage.bucket().name}/${pdfFileName}`;
    }

    // Subir imagen si existe
    if (thumbnailFile) {
      const imageBuffer = Buffer.from(thumbnailFile.data, "base64");
      const imageFileName = `studies/thumbnails/${Date.now()}_${thumbnailFile.name}`;
      const imageFileRef = storage.bucket().file(imageFileName);

      await imageFileRef.save(imageBuffer, {
        metadata: {
          contentType: thumbnailFile.type,
        },
      });

      await imageFileRef.makePublic();
      thumbnailUrl = `https://storage.googleapis.com/${storage.bucket().name}/${imageFileName}`;
    }

    // Crear documento en Firestore
    const studyData = {
      title,
      description,
      category,
      author,
      publishDate,
      tags,
      featured,
      pdfUrl,
      thumbnailUrl,
      downloadCount: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("studies").add(studyData);

    return {
      success: true,
      message: "Estudio creado exitosamente",
      studyId: docRef.id,
      pdfUrl,
      thumbnailUrl,
    };
  } catch (error) {
    functions.logger.error("Error creating study:", error);
    throw new functions.https.HttpsError("internal", "Error al crear el estudio");
  }
});

// Función para actualizar estudio con archivos
export const updateStudyWithFiles = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Usuario no autenticado");
  }

  try {
    const {
      studyId,
      title,
      description,
      category,
      author,
      publishDate,
      tags,
      featured,
      pdfFile,
      thumbnailFile,
      currentPdfUrl,
      currentThumbnailUrl,
    } = data;

    let pdfUrl = currentPdfUrl;
    let thumbnailUrl = currentThumbnailUrl;

    // Subir nuevo PDF si existe
    if (pdfFile) {
      // Eliminar PDF anterior si existe
      if (currentPdfUrl) {
        try {
          const bucket = storage.bucket();
          const pathMatch = currentPdfUrl.match(/\/o\/(.+?)\?/);
          if (pathMatch) {
            const decodedPath = decodeURIComponent(pathMatch[1]);
            await bucket.file(decodedPath).delete();
          }
        } catch (error) {
          functions.logger.warn("Error deleting old PDF:", error);
        }
      }

      const pdfBuffer = Buffer.from(pdfFile.data, "base64");
      const pdfFileName = `studies/pdfs/${Date.now()}_${pdfFile.name}`;
      const pdfFileRef = storage.bucket().file(pdfFileName);

      await pdfFileRef.save(pdfBuffer, {
        metadata: {
          contentType: pdfFile.type,
        },
      });

      await pdfFileRef.makePublic();
      pdfUrl = `https://storage.googleapis.com/${storage.bucket().name}/${pdfFileName}`;
    }

    // Subir nueva imagen si existe
    if (thumbnailFile) {
      // Eliminar imagen anterior si existe
      if (currentThumbnailUrl) {
        try {
          const bucket = storage.bucket();
          const pathMatch = currentThumbnailUrl.match(/\/o\/(.+?)\?/);
          if (pathMatch) {
            const decodedPath = decodeURIComponent(pathMatch[1]);
            await bucket.file(decodedPath).delete();
          }
        } catch (error) {
          functions.logger.warn("Error deleting old thumbnail:", error);
        }
      }

      const imageBuffer = Buffer.from(thumbnailFile.data, "base64");
      const imageFileName = `studies/thumbnails/${Date.now()}_${thumbnailFile.name}`;
      const imageFileRef = storage.bucket().file(imageFileName);

      await imageFileRef.save(imageBuffer, {
        metadata: {
          contentType: thumbnailFile.type,
        },
      });

      await imageFileRef.makePublic();
      thumbnailUrl = `https://storage.googleapis.com/${storage.bucket().name}/${imageFileName}`;
    }

    // Actualizar documento en Firestore
    const updateData = {
      title,
      description,
      category,
      author,
      publishDate,
      tags,
      featured,
      pdfUrl,
      thumbnailUrl,
      updatedAt: FieldValue.serverTimestamp(),
    };

    await db.collection("studies").doc(studyId).update(updateData);

    return {
      success: true,
      message: "Estudio actualizado exitosamente",
      studyId,
      pdfUrl,
      thumbnailUrl,
    };
  } catch (error) {
    functions.logger.error("Error updating study:", error);
    throw new functions.https.HttpsError("internal", "Error al actualizar el estudio");
  }
});

// Función para eliminar estudio y sus archivos
export const deleteStudyWithFiles = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Usuario no autenticado");
  }

  try {
    const {studyId} = data;

    // Obtener datos del estudio
    const studyDoc = await db.collection("studies").doc(studyId).get();
    if (!studyDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Estudio no encontrado");
    }

    const studyData = studyDoc.data();

    // Eliminar archivos de Storage
    if (studyData?.pdfUrl) {
      try {
        const bucket = storage.bucket();
        const pathMatch = studyData.pdfUrl.match(/\/o\/(.+?)\?/);
        if (pathMatch) {
          const decodedPath = decodeURIComponent(pathMatch[1]);
          await bucket.file(decodedPath).delete();
        }
      } catch (error) {
        functions.logger.warn("Error deleting PDF:", error);
      }
    }

    if (studyData?.thumbnailUrl) {
      try {
        const bucket = storage.bucket();
        const pathMatch = studyData.thumbnailUrl.match(/\/o\/(.+?)\?/);
        if (pathMatch) {
          const decodedPath = decodeURIComponent(pathMatch[1]);
          await bucket.file(decodedPath).delete();
        }
      } catch (error) {
        functions.logger.warn("Error deleting thumbnail:", error);
      }
    }

    // Eliminar documento
    await db.collection("studies").doc(studyId).delete();

    return {
      success: true,
      message: "Estudio eliminado exitosamente",
    };
  } catch (error) {
    functions.logger.error("Error deleting study:", error);
    throw new functions.https.HttpsError("internal", "Error al eliminar el estudio");
  }
});
