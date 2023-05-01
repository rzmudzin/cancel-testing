const github = require('@actions/github');
const core = require('@actions/core');


async function run() {
    
    //Extract the passed token and obtain repo info from context
    const token = process.argv[2];
    const { eventName, sha, ref, repo: { owner, repo }, payload, } = github.context;
    const { GITHUB_RUN_ID } = process.env;
    let branch = ref.slice(11);
    let runId = Number(GITHUB_RUN_ID);
    console.log('Owner: ' + owner);
    console.log('Repo" ' + repo);

    //Connect to github and get the current run's info
    const octokit = github.getOctokit(token);
    const { data: current_run } = await octokit.rest.actions.getWorkflowRun({
        owner,
        repo,
        run_id: runId,
    });
    //Log the current run for any debugging needs that arise
    console.log(current_run);
    let workflow_id = current_run.workflow_id;

    //Extract a list of all the recent runs
    const { data: { total_count, workflow_runs }, } = await octokit.rest.actions.listWorkflowRuns({
        per_page: 100,
        owner,
        repo,
        workflow_id,
        branch,
    });
    console.log('Run Count: ' + total_count);

    //Cancel the current run
    // console.log(`Cancel current run ${runId}`);
    // const result = await octokit.rest.actions.cancelWorkflowRun({
    //         owner,
    //         repo,
    //         run_id: runId,
    //     });
    // console.log(`Cancel run ${runId} responded with status ${result.status}`);

    

}

run();