import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal, type ModalFuncProps } from "antd";

export const useConfirmFactory = (
  modal: ReturnType<typeof Modal.useModal>[0]
) => {
  return (overrides?: Partial<ModalFuncProps>): Promise<boolean> =>
    new Promise((resolve) => {
      modal.confirm({
        title: "Выйти из системы?",
        icon: <ExclamationCircleFilled />,
        content: "Вы уверены, что хотите завершить сеанс?",
        okText: "Выйти",
        cancelText: "Отмена",
        centered: true,
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
        ...overrides,
      });
    });
};
