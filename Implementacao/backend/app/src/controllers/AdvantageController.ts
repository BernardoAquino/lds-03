import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

/** Repositories */
import AdvantageRepository from '../repositories/AdvantageRepository';
import BusinessRepository from '../repositories/BusinessRepository';

class AdvantageController {
    listAllOwnedByBusiness = async (req: Request, res: Response) => {
        try {
            const { id } = req.empresa;

            if (!id) {
                throw new Error('Você precisa ser uma empresa autenticada para realizar essa operação');
            }

            const advantages = await AdvantageRepository.getByBusinessId(id);

            return res.status(StatusCodes.OK).json({ advantages });
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'ADV500LB',
                message: error?.message ?? 'No message'
            })
        }
    }

    listAll = async (req: Request, res: Response) => {
        try {
            const { id } = req.aluno;

            if (!id) {
                throw new Error('Você precisa ser um aluno autenticada para realizar essa operação');
            }

            const advantages = await AdvantageRepository.findAll();

            return res.status(StatusCodes.OK).json({ advantages });   
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'ADV500LS',
                message: error?.message ?? 'No message'
            })
        }
    }

    create = async (req: Request, res: Response) => {
        try {
            const { id } = req.empresa;
            const { advantage } = req.body;

            if (!id) {
                throw new Error('Você precisa ser uma empresa autenticada para realizar essa operação');
            }

            const business = await BusinessRepository.getById(id);

            if (!business) {
                throw new Error('Empresa não encontrada');
            }

            const createdAdvantage = await AdvantageRepository.create(business, advantage);

            return res.status(StatusCodes.CREATED).json({ createdAdvantage });
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'ADV500C',
                message: error?.message ?? 'No message'
            })
        }
    }

    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.empresa;
            const { id: advantageId } = req.params;
            const { advantage } = req.body;

            if (!advantageId || Number.isNaN(advantageId)) {
                throw new Error('Você precisa informar qual departamento será atualizado');
            }

            if (!id) {
                throw new Error('Você precisa ser uma empresa autenticada para realizar essa operação');
            }

            const business = await BusinessRepository.getById(id);

            if (!business) {
                throw new Error('Empresa não encontrada');
            }

            const updatedAdvantage = await AdvantageRepository.update(Number(advantageId), advantage);

            return res.status(StatusCodes.OK).json({ updatedAdvantage });
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'ADV500U',
                message: error?.message ?? 'No message'
            })
        }
    }

    delete = async (req: Request, res: Response) => {
        try {
            const { id: businessId } = req.empresa;
            const { id } = req.params;
            const advantageId = Number(id);

            if (!id) {
                throw new Error('Você precisa fornecer o ID da vantagem a ser removido');
            }

            const advantage = await AdvantageRepository.getById(advantageId);

            if (advantage?.empresa.id !== businessId) {
                throw new Error('A vantagem selecionado não pertence a essa empresa');
            }

            const deleted = await AdvantageRepository.delete(advantageId);

            if (!deleted) {
                throw new Error('Ocorreu um erro ao deletar a vantagem');
            }

            return res.status(StatusCodes.GONE).json({ deleted });
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'ADV500D',
                message: error?.message ?? 'No message'
            })
        }
    }
}

export default new AdvantageController();