const github = require('@actions/github');
const core = require('@actions/core');

// async function run() {
//     // This should be a token with access to your repository scoped in as a secret.
//     // The YML workflow will need to set myToken with the GitHub Secret Token
//     // myToken: ${{ secrets.GITHUB_TOKEN }}
//     // https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret
//     const myToken = core.getInput('myToken');

//     const octokit = github.getOctokit(myToken)

//     // You can also pass in additional options as a second parameter to getOctokit
//     // const octokit = github.getOctokit(myToken, {userAgent: "MyActionVersion1"});

//     const { data: pullRequest } = await octokit.rest.pulls.get({
//         owner: 'octokit',
//         repo: 'rest.js',
//         pull_number: 123,
//         mediaType: {
//           format: 'diff'
//         }
//     });

//     console.log(pullRequest);
// }

// run();
async function run() {
    console.log('Hello Demo');
    process.argv.forEach(function (val, index, array) {
        console.log(index + ': ' + val);
    });
    const token = process.argv[2];
    console.log('Token: ' + token);
    const { eventName, sha, ref, repo: { owner, repo }, payload, } = github.context;
    const { GITHUB_RUN_ID } = process.env;
    let runId = Number(GITHUB_RUN_ID);
    let branch = ref.slice(11);
    const octokit = github.getOctokit(token);
    const { data: current_run } = await octokit.rest.actions.getWorkflowRun({
        owner,
        repo,
        run_id: Number(GITHUB_RUN_ID),
    });
    console.log(`Cancel current run ${runId}`);
    const result = await octokit.rest.actions.cancelWorkflowRun({
            owner,
            repo,
            run_id: runId,
        });
    console.log(`Cancel run ${runId} responded with status ${result.status}`);
    console.log(current_run);

    var moment = require('moment');
    var date = moment().format('LL');
    console.log(date);
    console.log('Done');
}

run();