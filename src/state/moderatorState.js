import { atom, selector } from "recoil";

//Moderator state
export const moderatorState = atom({
    key: "listModerators",
    default: [],
  });

  export const moderatorsComboboxData = atom({
    key: "listModeratorsCombobox",
    default: [],
  });

  export const moderatorComboboxDataState = selector({	
    key: 'listModeratorsComboboxData',
    get: ({ get }) => {
      const list = get(moderatorsComboboxData);	
      return list.map((item) => {
        return {
           value: item.id, 
           label: `${item.fullname} - ${item.email}`,
        }
      });	
    }
  });

