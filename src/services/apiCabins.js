import supabase, { supabaseUrl } from './supabase';

export async function getCabins() {
  const { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.error('cabins could not be loaded');
    throw new Error('cabins could not be loaded');
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    '/',
    ''
  );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images//${imageName}`;

  //1. Create/Edit Cabin
  let query = supabase.from('cabins');
  //a.Create the Cabin
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);
  //b. Edit the Cabin
  if (id)
    query = query.update([{ ...newCabin, image: imagePath }]).eq('id', id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error('Cabins item could not be created');
  }

  //2.Upload the Image
  if (hasImagePath) return data;

  // const avatarFile = event.target.files[0];
  const { error: storageError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, newCabin.image);

  //3. Delete the cabin if there was an error uploading the corresponding image

  if (storageError) {
    await supabase.from('cabins').delete().eq('id', data.id);
    console.error(storageError);
    throw new Error('There was a problem uploading the image');
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from('cabins').delete().eq('id', id);

  if (error) {
    console.error();
    throw new Error('Unable to delete the cabin due to an error.');
  }

  return data;
}
