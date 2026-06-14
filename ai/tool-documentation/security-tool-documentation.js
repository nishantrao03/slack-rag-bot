const securityAgentTools = [
  {
    type: "function",
    function: {
      name: "get_user_projects",
      description: "Retrieves the list of projects a user belongs to. Use when a project-specific request is received in a DM or group chat and the target project cannot be determined from the conversation context. Do not use when the project has already been identified. If multiple projects are returned and the intended project is unclear, ask the user which project they are referring to.",
      parameters: {
        type: "object",
        properties: {
          userId: {
            type: "string",
            description: "Slack user ID."
          }
        },
        required: [
          "userId"
        ]
      }
    }
  },

  {
    type: "function",
    function: {
      name: "create_project_workflow",
      description: "Creates a new project and performs all required setup, including creating the user if needed, assigning the creator as project manager, linking the project to the thread when applicable, and updating caches. Use when a user requests creation of a new project. Do not manually recreate this workflow using individual project creation tools.",
      parameters: {
        type: "object",
        properties: {
          userId: {
            type: "string",
            description: "Slack user ID of the project creator."
          },
          projectName: {
            type: "string",
            description: "Name of the project to create."
          },
          threadId: {
            type: "string",
            description: "Thread ID to associate with the project when applicable."
          }
        },
        required: [
          "userId",
          "projectName"
        ]
      }
    }
  },

  {
    type: "function",
    function: {
      name: "link_project_to_thread",
      description: "Links a Slack thread to a project in the database. Use when a project association needs to be stored for a private DM thread or group chat thread. Do not use for channel conversations. Only use this tool when the request originates from a conversation whose channel ID starts with 'D' or 'G'. Never use this tool when the channel ID starts with 'C'.",
      parameters: {
        type: "object",
        properties: {
          projectId: {
            type: "string",
            description: "Unique identifier of the project."
          },
          threadId: {
            type: "string",
            description: "Slack thread identifier."
          }
        },
        required: [
          "projectId",
          "threadId"
        ]
      }
    }
  }
];

export default securityAgentTools;