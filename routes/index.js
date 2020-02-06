const express = require('express');
const Git = require("nodegit");
const debug = require('debug')('preso');
const gittools = require('../modules/gittools');
const settings = require('../settings');

const router = express.Router();

router.get('/', (req, res) => {
    let isValidRepo = false;
    let isClean = true;
    const errors = [];
    const gitRoot = settings.gitRoot;

    debug(gitRoot);

    Git.Repository.open(gitRoot)
        .then((repo) => {
            isValidRepo = true;

            return repo.getStatus()
                .then((statuses) => {
                    const changed = [];

                    statuses.forEach((status) => {
                        if (!gittools.cleanFile(status)) {
                            changed.push(status.path());
                            isClean = false;
                        }
                    });

                    return changed;
                })
                .then((changed) => {
                    if (changed.length) {
                        errors.push(`The following file(s) have changed: ${changed.join(', ')}.`);
                        errors.push('We will be unable to perform Git checkouts.');
                        errors.push('Please make sure the working folder is clean, then reload this page.');
                    }
                });
        })
        .catch((ex) => {
            debug(ex);
            errors.push(ex.message);
        })
        .finally(() => {
            res.render('index', {
                title: 'Pre-Flight',
                errors,
                isValidRepo,
                isClean,
                gitRoot
            });
        });
});

module.exports = router;
