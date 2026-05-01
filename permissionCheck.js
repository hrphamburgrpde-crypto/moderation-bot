module.exports = {
    hasPermission(interaction, permission) {

        if (!interaction.memberPermissions) return false;

        return interaction.memberPermissions.has(permission);
    }
};