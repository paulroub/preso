const gittools = require('../modules/gittools');

function makeStatus(options) {
    const opts = {
        inIndex: false,
        isModified: false,
        isDeleted: false,
        isNew: false,
        isRenamed: false,
        ...options
    };

    const status = {};

    Object.keys(opts).forEach((vari) => {
        const value = opts[vari];

        status[vari] = () => {
            return value;
        };
    });

    return status;
}

test('clean file', () => {
    const status = makeStatus();

    expect(gittools.cleanFile(status)).toBeTruthy();
});

test('modified file', () => {
    const status = makeStatus({ isModified: true });

    expect(gittools.cleanFile(status)).toBeFalsy();
});

test('deleted file', () => {
    const status = makeStatus({ isDeleted: true });

    expect(gittools.cleanFile(status)).toBeFalsy();
});

test('new file, not in index', () => {
    const status = makeStatus({ isNew: true });

    expect(gittools.cleanFile(status)).toBeTruthy();
});

test('new file, in index', () => {
    const status = makeStatus({ inIndex: true, isNew: true });

    expect(gittools.cleanFile(status)).toBeFalsy();
});

test('renamed file', () => {
    const status = makeStatus({ isRenamed: true });

    expect(gittools.cleanFile(status)).toBeFalsy();
});
