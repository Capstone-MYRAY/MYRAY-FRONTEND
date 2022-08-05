import { atom } from "recoil";

//Tree type state
export const statisticState = atom({
  key: "listStatistic",
  default: {
    total_money: 0,
    total_job_post: 0,
    total_landowner: 0,
    total_farmer: 0,
  },
});

export const chartDataState = atom({
  key: "chartData",
  default: {},
});
