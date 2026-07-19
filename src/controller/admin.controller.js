import { 
    findAllUserService
    ,findUserByIdService
    ,createATeacherService
    ,updateUserService
    ,deleteUserService 
} from "../service/admin.service.js";


export const findAllUserController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search || "";

    const result = await findAllUserService(page, limit, search);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
export const findUserByIdController = async (req, res) => {
  try {
        const result = await findUserByIdService(req.params.id);
        return res.status(200).json({ user: result });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const createTeacherController = async (req, res) => {
  try {
        const {name,email,password} = req.body;
        const teacher = await createATeacherService(name, email, password);
        return res.status(200).json({ result: teacher });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateUserController = async (req, res) => {
  try {

    const id = await req.params.id;
    const {name,email,password} = await req.body;

    const result = await updateUserService(id,name,email,password);
    return res.status(200).json({ result: result });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteUserController = async (req, res) => {
  try {

    const result = await deleteUserService(req.params.id);

    if(result == null) return res.status(404).json("User Not Found");

    return res.status(200).json("Bye bye");

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};




