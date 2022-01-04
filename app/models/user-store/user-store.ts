import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { Alert } from "react-native";
import { Api } from "../../services/api"

/**
 * Model description here for TypeScript hints.
 */
const api = new Api()
export const UserStoreModel = types
  .model("UserStore")
  .props({
    userData: types.optional(types.frozen(), null),
    page: 0,
    loading: false,
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    callGetUser: flow(function* callGetUser() {
      self.loading = true;
      const response = yield api.getData(self.page)
      //console.log("response-----=====", response.data.hits);

      if (response.kind === "ok") {
        self.userData = response.data.hits;
        self.loading = false;
      } else {
        self.userData = null
        console.log("kind-->>>", response.kind);
      }
    }),

    callLoadMore: flow(function* callLoadMore() {
      self.page = self.page + 1;
      console.log("page---", self.page);
      self.loading = true;
      const response = yield api.getData(self.page)
      console.log("called");

      //console.log("new-----=====", response.data.hits);
      // const newData = [...self.userData, ...response.data.hits];

      if (response.kind === "ok") {
        self.userData = [...self.userData, ...response.data.hits];
        self.loading = false;
      } else {
        self.userData = null
        console.log("kind-->>>", response.kind);
      }

      // if (response.kind === "ok") {
      //   //console.log("new---->>>>", response.data.hits)
      //   var mergeList = [...self.userData, ...response.data.hits]
      //   if (self.page == 1) mergeList = [...response.data.hits]
      //   console.log("mergeList", mergeList);

      //   // self.users = mergeList
      //   self.loading = false
      //   self.setList(mergeList)
      //   return { data: response.data.hits };
      // } else {
      //   console.log("error");
      //   return null
      // }

    })

  })) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
* Un-comment the following to omit model attributes from your snapshots (and from async storage).
* Useful for sensitive data like passwords, or transitive state like whether a modal is open.

* Note that you'll need to import `omit` from ramda, which is already included in the project!
*  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
*/

type UserStoreType = Instance<typeof UserStoreModel>
export interface UserStore extends UserStoreType { }
type UserStoreSnapshotType = SnapshotOut<typeof UserStoreModel>
export interface UserStoreSnapshot extends UserStoreSnapshotType { }
