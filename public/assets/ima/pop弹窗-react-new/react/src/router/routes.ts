import Frame_10_277 from "@/views/Frame_10_277";

export const routes = [{
          path: "/",
          component: Frame_10_277,
          guid: "10:277",
        }];


export const guidPathMap = new Map(
  routes.map((item) => [item.guid, item.path])
);
export const pathGuidMap = new Map(
  routes.map((item) => [item.path, item.guid])
);

export const getPathByGuid = (guid: string) => {
  return guidPathMap.get(guid);
};

export const getGuidByPath = (path: string) => {
  return pathGuidMap.get(path);
};
