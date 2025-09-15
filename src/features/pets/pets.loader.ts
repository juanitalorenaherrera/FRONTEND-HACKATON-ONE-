// src/features/pets/pets.loader.ts

import { getAllPets, getPetById } from "@/services/petService";

export const petsLoader = async () => {
  const pets = await getAllPets();
  return { pets };
};

export const petProfileLoader = async ({ params }: { params: any }) => {
  const { petId } = params;
  if (!petId) throw new Response("Not Found", { status: 404 });
  
  const pet = await getPetById(Number(petId));
  return { pet };
};