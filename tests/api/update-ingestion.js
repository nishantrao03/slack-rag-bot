import updateIngestion from "../../tools/api-call/update-ingestion.js";

async function updateIngestionTest() {
  try {
    const update_json = {
        "extracted_updates": [
            {
                "atomic_fact": "The primary database was migrated from PostgreSQL 12 to PostgreSQL 15.",
                "context": "Primary database infrastructure for the core engineering team.",
                "search_query": "primary database infrastructure",
                "update_type": "modification"
            },
            {
                "atomic_fact": "Query latency across the main reporting dashboard was reduced by 25%.",
                "context": "Main reporting dashboard query performance metrics.",
                "search_query": "reporting dashboard query latency",
                "update_type": "modification"
            },
            {
                "atomic_fact": "A real-time collaboration feature allowing up to 10 users to edit a single document simultaneously was introduced into the beta branch.",
                "context": "Beta branch document editing capabilities.",
                "search_query": "real-time collaboration feature",
                "update_type": "addition"
            }
        ]

    };

//     {
// "extracted_updates": [
// {
// "atomic_fact": "The primary database was migrated from PostgreSQL 12 to PostgreSQL 15.",
// "context": "Primary database infrastructure for the core engineering team.",
// "search_query": "primary database infrastructure",
// "update_type": "modification"
// },
// {
// "atomic_fact": "Query latency across the main reporting dashboard was reduced by 25%.",
// "context": "Main reporting dashboard query performance metrics.",
// "search_query": "reporting dashboard query latency",
// "update_type": "modification"
// },
// {
// "atomic_fact": "A real-time collaboration feature allowing up to 10 users to edit a single document simultaneously was introduced into the beta branch.",
// "context": "Beta branch document editing capabilities.",
// "search_query": "real-time collaboration feature",
// "update_type": "addition"
// },
// {
// "atomic_fact": "The target release date for rolling out the real-time collaboration beta to all enterprise users was delayed from August 15th to September 1st.",
// "context": "Enterprise user beta rollout schedule for the collaboration feature.",
// "search_query": "collaboration beta release date",
// "update_type": "modification"
// },
// {
// "atomic_fact": "The legacy SOAP API endpoints v1.1 and v1.2 were completely removed from the production environment.",
// "context": "Legacy production API endpoint availability.",
// "search_query": "soap api endpoints",
// "update_type": "deletion"
// },
// {
// "atomic_fact": "All partner traffic was routed to the new RESTful v2.0 API.",
// "context": "Partner API traffic routing infrastructure.",
// "search_query": "partner traffic routing",
// "update_type": "modification"
// },
// {
// "atomic_fact": "Sarah Jenkins stepped down as the Lead QA Engineer to transition to a new internal product management role.",
// "context": "Lead QA Engineer personnel status.",
// "search_query": "lead qa engineer personnel",
// "update_type": "deletion"
// },
// {
// "atomic_fact": "Marcus Torres will replace Sarah Jenkins as the Lead QA Engineer effective next Monday.",
// "context": "Lead QA Engineer role assignment.",
// "search_query": "lead qa engineer role",
// "update_type": "modification"
// },
// {
// "atomic_fact": "The weekly cross-departmental sync meeting was rescheduled from Tuesdays at 10 AM to Thursdays at 2 PM.",
// "context": "Weekly cross-departmental sync meeting schedule.",
// "search_query": "cross-departmental sync meeting",
// "update_type": "modification"
// }
// ]
// }

    const project_id = "08cafc23-9bab-4b0e-98c4-9c95ca1dd9e3";

    const result = await updateIngestion(update_json, project_id);
    console.log("Update Ingestion Result:", result);
  } catch (error) {
    console.error("Error during update ingestion test:", error);
  }
}

updateIngestionTest();

// To run this test, use the command: node tests/api/update-ingestion.js