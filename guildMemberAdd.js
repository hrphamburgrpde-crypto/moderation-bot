const logger = require('../utils/logger');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        await logger(
            client,
            member.guild,
            "👋 Member gejoined",
            `User: ${member.user.tag}`,
            0x00ff00
        );
    }
};