const Git = require("nodegit");
const express = require('express');
const settings = require('../settings');

const router = express.Router();

router.get('/', (req, res) => {
    const response = [];

    Git.Repository.open(settings.gitRoot)
        .then((repo) => {
            return repo.getMasterCommit();
        })
        .then((firstCommitOnMaster) => {
            const history = firstCommitOnMaster.history();

            history.on('commit', (commit) => {
                response.push(
                    {
                        commit: commit.sha(),
                        message: commit.message()
                    }
                );
            });

            history.on('end', () => {
                res.json(response.reverse());
            });

            history.start();
        })
        .catch((ex) => {
            res.sendStatus(500);
            res.send(ex);
        });
});

router.get('/checkout', (req, res) => {
    const sha = req.query.sha;
    let repo = null;

    Git.Repository.open(settings.gitRoot)
        .then((openedRepo) => {
            repo = openedRepo;
            return repo.getCommit(sha);
        })
        .then((commit) => {
            return Git.Checkout
                .tree(repo, commit, { checkoutStrategy: Git.Checkout.STRATEGY.SAFE })
                .then(() => {
                    return repo.setHeadDetached(commit, repo.defaultSignature);
                });
        })
        .then(() => {
            const diffUrl = `http://127.0.0.1:1234/?p=.git;a=commitdiff;h=${sha};ds=sidebyside`;

            res.json({
                success: true,
                message: `checked out ${sha}`,
                diffUrl
            });
        })
        .catch((ex) => {
            res.sendStatus(500);
            res.send(ex);
        });
});

module.exports = router;
