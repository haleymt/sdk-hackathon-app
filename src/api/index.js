import * as Abstract from "abstract-sdk";

const client = new Abstract.Client({});

export const fetchProjects = async () => {
  return await client.projects.list({
    organizationId: "8a13eb62-a42f-435f-b3a3-39af939ad31b"
  });
}
