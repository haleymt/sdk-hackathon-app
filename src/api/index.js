import * as Abstract from "abstract-sdk";

const apiClient = new Abstract.Client({
});

export const fetchProjects = async () => {
  return await apiClient.projects.list({
    organizationId: "8a13eb62-a42f-435f-b3a3-39af939ad31b"
  });
}

export const fetchProjectAssets = async (projectId) => {
  try {
    const results = await apiClient.assets.list({
      projectId,
      branchId: "master",
      sha: "latest"
    });
    return results;
  } catch (err) {
    console.log(err);
    return [];
  }
}
