import ClientApiRequest from '@/src/lib/clientApiRouter';
import {LoadingContext} from '@/src/store/providers/loadingProvider';
import {GetUserScreen, ListScreen, UpdateUserScreen} from '@/types/screens';
import React from 'react';
import FormButton from '../../auth/common/formButton/formButton';
import ClearButton from '../../common/button/clearButton';
import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import {ModalFooterContainer} from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import ScreenFields from './screenFields';

const updateScreen = async (data: UpdateUserScreen | null) => {
  if (!data) return;

  const response: {
    success: boolean;
    data: ListScreen;
  } = await ClientApiRequest({
    uri: `api/screen`,
    method: 'PUT',
    auth: true,
    data,
  });

  return response;
};

const getData = async (id: string) => {
  const res = await fetch(`/resources/screens/items/${id}`);
  const data = await res.json();
  return data as {
    success: boolean;
    data: GetUserScreen;
  };
};

export default function EditScreenModal({
  open,
  setOpen,
  id,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  onSubmit: (
    id: string, // data: ListScreen | null
    reason: 'approve' | 'deny' | 'edit' | 'undo',
  ) => void;
}) {
  const [isError, setIsError] = React.useState(false);
  const [formData, setFormData] = React.useState<UpdateUserScreen>({
    screen_id: '',
    name: '',
    settings: {
      genre_edm: 0,
      genre_pop: 0,
      genre_rnb: 0,
      rating_14: 0,
      rating_ma: 0,
      genre_folk: 0,
      genre_rock: 0,
      genre_indie: 0,
      genre_latin: 0,
      genre_family: 0,
      genre_hiphop: 0,
      genre_reggae: 0,
      genre_country: 0,
      genre_acoustic: 0,
      genre_americana: 0,
      genre_christian: 0,
      content_explicit: 0,
      content_interactive: 0,
    },
  });
  const {setLoading} = React.useContext(LoadingContext);

  console.log(formData, 'formData');

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (id) {
        const res = await getData(id);
        if (res.success) {
          setFormData({
            screen_id: res.data.id,
            name: res.data.name,
            settings: res.data.settings,
          });
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  React.useEffect(() => {
    if (!open) {
      const addScreenModal = document.querySelector('.addScreenModal');
      if (addScreenModal) {
        const formInputs = addScreenModal.querySelectorAll(
          'input, textarea, select',
        );
        const formErrorContainers =
          addScreenModal.querySelectorAll('.errorContainer');

        formInputs.forEach((input) => {
          input.classList.remove('error');
        });

        formErrorContainers.forEach((errorContainer) => {
          errorContainer.classList.remove('active');
          errorContainer?.removeAttribute('style');
        });
      }
    }
  }, [open]);

  return (
    <div>
      <Modal
        wrapperTestId="editScreenModal"
        className="editScreenModal"
        open={open}
        setOpen={setOpen}
      >
        <ModalHeader title="Edit Screen" description="Edit Screen Details." />
        <ModalDivider />
        <div className="contentContainer">
          <ScreenFields formData={formData} setFormData={setFormData} />
        </div>
        <ModalDivider />
        <ModalFooterContainer>
          <div className="footerButtonsContainer">
            <ClearButton
              data-testid="backEditScreenButton"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </ClearButton>
          </div>
          <div className="footerButtonsContainer">
            <FormButton
              data-testid="submitEditScreenButton"
              isError={isError}
              setIsError={setIsError}
              // className={`${modalClass}`}
              modalClass="editScreenModal"
              text="Update"
              successText="Updated!"
              onClick={async () => {
                const res = await updateScreen(formData);

                if (res && res.success) {
                  onSubmit(id, 'edit');
                }
              }}
              noIcon
            />
          </div>
        </ModalFooterContainer>
      </Modal>
    </div>
  );
}
