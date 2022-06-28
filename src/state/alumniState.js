import { atom, selector } from "recoil";
import { alumniStatus } from "variables/general";

//Area state
export const listAreaState = atom({
  key: "listAreas",
  default: [],
});

//Add new alumni list to alumniList
export const addListAlumni = (listAlumni, newList) => {
  const newListAlumni = [...listAlumni];
  newListAlumni.push(...newList);
  return newList;
}

//Paging
export const alumniPagingState = atom({
  key: "alumniPagingState",
  default: {
    name: 'alumni',
    paging: {'page': 1, 'page-size': 50}}
});