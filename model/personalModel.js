module.exports = (sequelize, DataTypes) => {
    const PersonalInfo = sequelize.define("personal_info", {
        student: {
            type: DataTypes.UUID
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        father: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mother: {
            type: DataTypes.STRING,
        },
        religion: {
            type: DataTypes.STRING,
        },
        nId: {
            type: DataTypes.STRING,
            defaultValue: "user",
        },
        dateOfBirth: {
            type: DataTypes.STRING,
        },
        bloodGroup: {
            type: DataTypes.STRING
        },
        whatsApp: {
            type: DataTypes.STRING
        },
        facebook: {
            type: DataTypes.STRING
        },
        linkedIn: {
            type: DataTypes.STRING
        },
        presentAddress: {
            type: DataTypes.UUID
        },
        permanentAddress: {
            type: DataTypes.STRING,
        },
        employmentStatus: {
            type: DataTypes.STRING,
        }
    }, {
        timestamps: false
      });

    return PersonalInfo;
};