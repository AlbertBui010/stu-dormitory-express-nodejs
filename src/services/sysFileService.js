const { SysFile, Student } = require("../models");
const createHttpError = require("http-errors");

const getAllFiles = async () => {
  return await SysFile.findAll({
    include: [
      {
        model: Student,
        as: "Creator",
        attributes: ["id", "name"],
        foreignKey: "created_by",
      },
    ],
  });
};

const getFileById = async (id) => {
  const file = await SysFile.findByPk(id);
  if (!file) {
    throw createHttpError.NotFound("File not found");
  }
  return file;
};

const createFile = async (fileData) => {
  return await SysFile.create(fileData);
};

const updateFile = async (id, updateData) => {
  const file = await getFileById(id);
  return await file.update(updateData);
};

const deleteFile = async (id) => {
  const file = await getFileById(id);
  await file.destroy();
  return { message: "File deleted successfully" };
};

const getFilesByType = async (type) => {
  return await SysFile.findAll({
    where: { type },
    include: [
      {
        model: Student,
        as: "Creator",
        attributes: ["id", "name"],
      },
    ],
  });
};

module.exports = {
  getAllFiles,
  getFileById,
  createFile,
  updateFile,
  deleteFile,
  getFilesByType,
};
