module.exports = {
    canModerate(interaction, targetMember) {

        const botMember = interaction.guild.members.me;

        // Bot selbst prüfen
        if (!botMember.permissions.has("Administrator")) {
            return false;
        }

        // Schutz: eigene Rolle muss höher sein als Ziel
        if (targetMember.roles.highest.position >= interaction.member.roles.highest.position) {
            return {
                allowed: false,
                reason: "❌ Du kannst keine User mit gleicher oder höherer Rolle moderieren."
            };
        }

        // Schutz: Bot muss auch höher sein
        if (targetMember.roles.highest.position >= botMember.roles.highest.position) {
            return {
                allowed: false,
                reason: "❌ Ich kann diesen User nicht moderieren (Role Hierarchy)."
            };
        }

        return { allowed: true };
    }
};