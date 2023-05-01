const github = require('@actions/github');
const core = require('@actions/core');


async function run() {
    console.log('Hello Demo');
    process.argv.forEach(function (val, index, array) {
        console.log(index + ': ' + val);
    });
    
    const token = process.argv[2];
    console.log('Token: ' + token);

    const { eventName, sha, ref, repo: { owner, repo }, payload, } = github.context;
    const { GITHUB_RUN_ID } = process.env;
    let branch = ref.slice(11);
    let runId = Number(GITHUB_RUN_ID);
    const workflow_id = core.getInput('workflow_id', { required: false });
    console.log('Owner: ' + owner);
    console.log('Repo" ' + repo);

    const octokit = github.getOctokit(token);
    const { data: current_run } = await octokit.rest.actions.getWorkflowRun({
        owner,
        repo,
        run_id: Number(GITHUB_RUN_ID),
    });
    const workflow_ids = [];
    workflow_ids.push(String(current_run.workflow_id));
    await Promise.all(workflow_ids.map(async (workflow_id) => {
        try {
            const { data: { total_count, workflow_runs }, } = await octokit.rest.actions.listWorkflowRuns({
                per_page: 100,
                owner,
                repo,
                workflow_id,
                branch,
            });
            console.log('Run Count: ' + total_count);
        }
        catch (e) {
            const msg = e.message || e;
            console.log(`Error while canceling workflow_id ${workflow_id}: ${msg}`);
        }
    }));

    // console.log(`Cancel current run ${runId}`);
    // const result = await octokit.rest.actions.cancelWorkflowRun({
    //         owner,
    //         repo,
    //         run_id: runId,
    //     });
    // console.log(`Cancel run ${runId} responded with status ${result.status}`);
    // console.log(current_run);

}

run();