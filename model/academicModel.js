module.exports = (sequelize, DataTypes) => {
    const AcademicInfo = sequelize.define("academic_info", {
        student: {
            type: DataTypes.UUID
        },
        course: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        intake: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
        },
        passingYear: {
            type: DataTypes.STRING,
            defaultValue: "student",
        },        
    }, {
        timestamps: false
      });

    return AcademicInfo;
};