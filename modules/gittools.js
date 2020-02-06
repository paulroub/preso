module.exports = {
    cleanFile(status) {
        const modded = status.isModified() || status.isDeleted() || status.isRenamed();
        const newAndMatters = status.inIndex() && status.isNew();

        return !(modded || newAndMatters);
    }
}