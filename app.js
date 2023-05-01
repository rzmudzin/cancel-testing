const github = require('@actions/github');
const core = require('@actions/core');

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

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
    // console.log(current_run);
    let workflow_id = current_run.workflow_id;
    let status = current_run.status;
    console.log('Run id ' + runId + ' from workflow ' + workflow_id + ' has a status of ' + status);

    //Extract a list of all the recent runs
    const { data: { total_count, workflow_runs }, } = await octokit.rest.actions.listWorkflowRuns({
        per_page: 100,
        owner,
        repo,
        workflow_id,
        branch,
    });
    console.log('Run Count: ' + total_count);

    //Poll for 1 minute
    for(var i=0; i<12; ++i) {
        console.log(i);
        await delay(5000);
        const { data: runInfo } = await octokit.rest.actions.getWorkflowRun({
            owner,
            repo,
            run_id: runId,
        });
        console.log('Run id ' + runId + ' from workflow ' + workflow_id + ' has a status of ' + runInfo.status);
    }

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