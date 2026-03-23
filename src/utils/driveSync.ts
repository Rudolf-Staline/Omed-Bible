export const DRIVE_FILES = {
  favorites: 'omed_bible_favorites.json',
  highlights: 'omed_bible_highlights.json',
  notes: 'omed_bible_notes.json',
  plans: 'omed_bible_plans.json',
  settings: 'omed_bible_settings.json',
  position: 'omed_bible_position.json',
};

const getFileId = async (fileName: string, token: string): Promise<string | null> => {
  try {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${fileName}'`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
  } catch (error) {
    console.error(`Error finding file ${fileName}:`, error);
  }
  return null;
};

export const syncFileToDrive = async (fileName: string, data: any, token: string) => {
  try {
    const fileId = await getFileId(fileName, token);
    const metadata = {
      name: fileName,
      parents: ['appDataFolder'],
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([JSON.stringify(data)], { type: 'application/json' }));

    const url = fileId
      ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
      : `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;

    const method = fileId ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    if (!res.ok) throw new Error(`Failed to upload ${fileName}`);
    return true;
  } catch (error) {
    console.error(`Error uploading ${fileName}:`, error);
    return false;
  }
};

export const syncFileFromDrive = async (fileName: string, token: string) => {
  try {
    const fileId = await getFileId(fileName, token);
    if (!fileId) return null;

    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`Failed to download ${fileName}`);
    return await res.json();
  } catch (error) {
    console.error(`Error downloading ${fileName}:`, error);
    return null;
  }
};
