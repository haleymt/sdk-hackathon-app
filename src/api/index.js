import * as Abstract from "abstract-sdk";

const apiClient = new Abstract.Client({
  accessToken: "c71642a864bf6d5340b579ddcc7a69bc146baf549117dc02e9e12017f7ddbcbf"
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

export const downloadAsset = async (asset, onSuccess) => {
  return await apiClient.assets.raw({
    assetId: asset.id,
    projectId: asset.projectId
  });
}
