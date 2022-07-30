import { atom, selector } from "recoil";

//Area state
export const listAreaState = atom({
  key: "listAreas",
  default: [],
});

//Province state
export const listProvinceState = atom({
  key: "listProvinces",
  default: [],
});

//District state
export const listDistrictState = atom({
  key: "listDistricts",
  default: [],
});

//Commune state
export const listCommuneState = atom({
  key: "listCommunes",
  default: [],
});

//Province Combobox Data
export const provinceComboboxData = selector({	
  key: 'listProvinceCombobox',
  get: ({ get }) => {
    const list = get(listProvinceState);	
    return list.map((item) => {
      return {
         value: item.id, 
         label: `${item.name}`,
      }
    });	
  }
});