import { Document, getAllDocs, getDoc, putDoc, deleteDoc } from './db';

const OLD_STORAGE_KEY = 'minwrite:content';

export async function createDocument(): Promise<Document> {
  const now = Date.now();
  const doc: Document = {
    id: crypto.randomUUID(),
    content: '',
    createdAt: now,
    modifiedAt: now,
  };
  await putDoc(doc);
  return doc;
}

export async function loadDocument(id: string): Promise<Document | undefined> {
  return getDoc(id);
}

export async function saveDocument(id: string, content: string): Promise<void> {
  const existing = await getDoc(id);
  if (!existing) {
    throw new Error(`Document not found: ${id}`);
  }
  await putDoc({
    ...existing,
    content,
    modifiedAt: Date.now(),
  });
}

export async function deleteDocument(id: string): Promise<void> {
  await deleteDoc(id);
}

export async function listDocuments(): Promise<Document[]> {
  return getAllDocs();
}

export async function migrateFromLocalStorage(): Promise<string | null> {
  const oldContent = localStorage.getItem(OLD_STORAGE_KEY);
  if (oldContent === null) {
    return null;
  }

  const now = Date.now();
  const doc: Document = {
    id: crypto.randomUUID(),
    content: oldContent,
    createdAt: now,
    modifiedAt: now,
  };
  await putDoc(doc);
  localStorage.removeItem(OLD_STORAGE_KEY);
  return doc.id;
}
