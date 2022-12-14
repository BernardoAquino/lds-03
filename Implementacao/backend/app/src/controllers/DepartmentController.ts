import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import InstituteRepository from '../repositories/InstituteRepository';

class DepartmentController {
    listAll = async (req: Request, res: Response) => {
        try {
            const { id: institutionIdStr } = req.params;
            const institutionId = Number(institutionIdStr);

            const departments = await InstituteRepository.getDepartmentsByInstitutionId(institutionId);

            return res.status(StatusCodes.OK).json({ departments });
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'DPT500L',
                message: error?.message ?? 'No message'
            })
        }
    }

    create = async (req: Request, res: Response) => {
        try {
            const { id } = req.instituicaoDeEnsino;
            const { department } = req.body;

            if (!id) {
                throw new Error('Você precisa ser uma instituição autenticada para realizar essa operação');
            }

            const institution = await InstituteRepository.getById(id);

            if (!institution) {
                throw new Error('Instituição não encontrada');
            }

            const createdDepartment = await InstituteRepository.addDepartment(institution, department);

            return res.status(StatusCodes.CREATED).json({ createdDepartment });
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'DPT500C',
                message: error?.message ?? 'No message'
            })
        }
    }

    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.instituicaoDeEnsino;
            const { id: departmentId } = req.params;
            const { department } = req.body;

            if (!departmentId || Number.isNaN(departmentId)) {
                throw new Error('Você precisa informar qual departamento será atualizado');
            }

            if (!id) {
                throw new Error('Você precisa ser uma instituição autenticada para realizar essa operação');
            }

            const institution = await InstituteRepository.getById(id);

            if (!institution) {
                throw new Error('Instituição não encontrada');
            }

            const updatedDepartment = await InstituteRepository.updateDepartment(Number(departmentId), department);

            return res.status(StatusCodes.OK).json({ updatedDepartment });
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'DPT500U',
                message: error?.message ?? 'No message'
            })
        }
    }

    delete = async (req: Request, res: Response) => {
        try {
            const { id: institutionId } = req.instituicaoDeEnsino;
            const { id } = req.params;
            const departmentId = Number(id);

            if (!id) {
                throw new Error('Você precisa fornecer o ID do departamento a ser removido');
            }

            const department = await InstituteRepository.getDepartmentById(departmentId);

            if (department?.instituicaoDeEnsino.id !== institutionId) {
                throw new Error('O departamento selecionado não pertence a essa instituição');
            }

            const deleted = await InstituteRepository.deleteDepartment(departmentId);

            if (!deleted) {
                throw new Error('Ocorreu um erro ao deletar o departamento');
            }

            return res.status(StatusCodes.GONE).json({ deleted });
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'DPT500D',
                message: error?.message ?? 'No message'
            })
        }
    }
}

export default new DepartmentController();