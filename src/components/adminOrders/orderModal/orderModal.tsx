import React from 'react';
import {useWindowSize} from 'usehooks-ts';

import MemoBack from '@/src/icons/back';
import MemoCart from '@/src/icons/cart';
import MemoClear from '@/src/icons/clear';
import MemoForward from '@/src/icons/forward';
import MemoOrderStart from '@/src/icons/order-start';
import MemoOrderStartMini from '@/src/icons/order-start-mini';
import InputValidationAll from '@/src/utils/InputValidationAll';

import ClientApiRequest from '@/src/lib/clientApiRouter';
import {OrdersAdminCreateData} from '@/types/orders';
import {VenueAdminData} from '@/types/venues';
import Button from '../../common/button/button';
import {ModalDivider} from '../../common/divider/divider';
import IconButton from '../../common/iconButton/iconButton';
import Modal from '../../common/modal/modal';
import {ModalFooterContainer} from '../../common/modal/modalFooter';
import ModalSelectLabelFuzzy from '../../common/modalSelectLabel/modalSelectLabelFuzzy';
import Slider from '../../common/slider/slider';
import Headers from './headers/headers';
import CheckInformation from './sliderItems/checkInformation';
import Devices from './sliderItems/devices';
import Information from './sliderItems/information';

const fetchVenues = async (businessId: string) => {
  const res = await ClientApiRequest({
    uri: `admin/venue/list?business_id=${businessId}`,
    method: 'GET',
    auth: true,
  });

  return res as {
    success: boolean;
    data: {
      total: number;
      venues: VenueAdminData[];
    };
  };
};

export default function OrderModal({
  open,
  setOpen,
  setCounter,
  counter,
  verifyOrderFunction,
  businessId,
  //venueData,
  //setVenueData,
  shippingData,
  setShippingData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  counter: number;
  setCounter:
    | ((number: number) => void)
    | React.Dispatch<React.SetStateAction<number>>;
  verifyOrderFunction?: () => void;
  businessId: string;
  //venueData: VenueAdminData | null;
  //setVenueData: React.Dispatch<React.SetStateAction<VenueAdminData | null>>;
  shippingData: OrdersAdminCreateData;
  setShippingData: React.Dispatch<React.SetStateAction<OrdersAdminCreateData>>;
}) {
  const [page, setPage] = React.useState(1);
  const {width} = useWindowSize();
  const [shipToVenue, setShipToVenue] = React.useState(true);
  //const [useContact, setUseContact] = React.useState(true);
  const [venueData, setVenueData] = React.useState<VenueAdminData | null>(null);
  const [venueList, setVenueList] = React.useState<VenueAdminData[]>([]);
  const [selectedVenue, setSelectedVenue] = React.useState<{
    id: string | number;
    name: string;
  } | null>(null);

  /*const [billingSameAsShipping, setBillingSameAsShipping] =
    React.useState(true);
  const [billingData, setBillingData] = React.useState<OrdersAdminCreateData>({
    product_id: '',
    quantity: 0,
    venue_id: '',
    shipping_address_1: '',
    shipping_address_2: '',
    shipping_city: '',
    shipping_state_code: '',
    shipping_country_code: '',
    shipping_zip: '',
    notes: {
      order_notes: '',
    },
  });
*/
  React.useEffect(() => {
    const fetchData = async () => {
      const venues = await fetchVenues(businessId);
      if (venues.success) {
        if (venues.data && venues.data.venues) {
          setVenueList(venues.data.venues);
          setSelectedVenue({
            id: venues.data.venues[0]?.id || '',
            name: venues.data.venues[0]?.name || '',
          });
        } else {
          console.log('No venues found');
        }
      } else console.error('Error fetching venues');
    };

    if (venueList && venueList.length === 0) fetchData();
  }, [venueList]);

  React.useEffect(() => {
    if (!open && venueList && typeof venueList[0] !== 'undefined') {
      setPage(1);
      setShipToVenue(true);
      setSelectedVenue({
        id: venueList[0]?.id || '',
        name: venueList[0]?.name || '',
      });
      setShippingData({
        ...shippingData,
        business_id: businessId,
        quantity: 1,
        venue_id: venueList[0]?.id || '',
        shipping_address_1: venueList[0]?.address_1 || '',
        shipping_address_2: venueList[0]?.address_2 || '',
        shipping_city: venueList[0]?.city || '',
        shipping_state_code: venueList[0]?.state_code || '',
        shipping_country_code: venueList[0]?.country_code || '',
        shipping_zip: venueList[0]?.zip || '',
        notes: {
          order_notes: '',
        },
      });
    }
  }, [open]);

  React.useEffect(() => {
    if (selectedVenue && venueList) {
      const venue = venueList.find((v) => v.id === selectedVenue.id);
      if (!venue) return;
      setVenueData(venue);
      setShippingData({
        ...shippingData,
        venue_id: selectedVenue.id as string,
      });
    }
  }, [selectedVenue, venueList]);

  React.useEffect(() => {
    const shippingDataEl = document.querySelector('.shippingData');
    if (!shipToVenue) {
      if (shippingDataEl) {
        const inputContainers =
          shippingDataEl.querySelectorAll('.modalInputControl');

        const selectContainers = shippingDataEl.querySelectorAll(
          '.modalSelectControl',
        );

        const containers = [...inputContainers, ...selectContainers];

        const formData = shippingDataEl.querySelectorAll(
          'input, textarea, select',
        );
        containers.forEach((el: Element) => {
          el.classList.remove('disabledInput');
        });

        formData.forEach((el: Element) => {
          (el as HTMLInputElement).readOnly = false;
          (el as HTMLSelectElement).disabled = false;
          (el as HTMLTextAreaElement).readOnly = false;
        });

        setShippingData({
          ...shippingData,
          shipping_address_1: '',
          shipping_address_2: '',
          shipping_city: '',
          shipping_state_code: '',
          shipping_country_code: '',
          shipping_zip: '',
        });
      }
    } else {
      if (shippingDataEl) {
        const inputContainers =
          shippingDataEl.querySelectorAll('.modalInputControl');

        const selectContainers = shippingDataEl.querySelectorAll(
          '.modalSelectControl',
        );

        const containers = [...inputContainers, ...selectContainers];

        //console.log('containers', containers);
        const formData = shippingDataEl.querySelectorAll(
          'input, textarea, select',
        );
        containers.forEach((el: Element) => {
          el.classList.add('disabledInput');
        });
        formData.forEach((el: Element) => {
          (el as HTMLInputElement).readOnly = true;
          (el as HTMLSelectElement).disabled = true;
          (el as HTMLTextAreaElement).readOnly = true;
        });
      }
      if (!venueData) return;
      setShippingData({
        ...shippingData,
        //business_name: venueData.business_name,
        shipping_address_1: venueData.address_1 || '',
        shipping_address_2: venueData.address_2 || '',
        shipping_city: venueData.city || '',
        shipping_state_code: venueData.state_code || '',
        shipping_country_code: venueData.country_code || '',
        shipping_zip: venueData.zip || '',
      });
    }
  }, [shipToVenue, venueData]);

  /*
  React.useEffect(() => {
    const billingDataEl = document.querySelector('.billingData');
    if (!billingSameAsShipping) {
      if (billingDataEl) {
        const inputContainers =
          billingDataEl.querySelectorAll('.modalInputControl');

        const selectContainers = billingDataEl.querySelectorAll(
          '.modalSelectControl',
        );

        const containers = [...inputContainers, ...selectContainers];

        const formData = billingDataEl.querySelectorAll(
          'input, textarea, select',
        );
        containers.forEach((el: Element) => {
          el.classList.remove('disabledInput');
        });

        formData.forEach((el: Element) => {
          (el as HTMLInputElement).readOnly = false;
          (el as HTMLSelectElement).disabled = false;
          (el as HTMLTextAreaElement).readOnly = false;
        });

        setBillingData({
          ...shippingData,
          venue_id: '',
          shipping_address_1: '',
          shipping_address_2: '',
          shipping_city: '',
          shipping_state_code: '',
          shipping_country_code: '',
          shipping_zip: '',
        });
      }
    } else {
      if (billingDataEl) {
        const inputContainers =
          billingDataEl.querySelectorAll('.modalInputControl');

        const selectContainers = billingDataEl.querySelectorAll(
          '.modalSelectControl',
        );

        const containers = [...inputContainers, ...selectContainers];

        console.log('containers', containers);
        const formData = billingDataEl.querySelectorAll(
          'input, textarea, select',
        );
        containers.forEach((el: Element) => {
          el.classList.add('disabledInput');
        });
        formData.forEach((el: Element) => {
          (el as HTMLInputElement).readOnly = true;
          (el as HTMLSelectElement).disabled = true;
          (el as HTMLTextAreaElement).readOnly = true;
        });
      }
      setBillingData({
        ...shippingData,
        //business_name: venueData.business_name,
        shipping_address_1: shippingData.shipping_address_1,
        shipping_address_2: shippingData.shipping_address_2,
        shipping_city: shippingData.shipping_city,
        shipping_state_code: shippingData.shipping_state_code,
        shipping_country_code: shippingData.shipping_country_code,
        shipping_zip: shippingData.shipping_zip,
      });
    }
  }, [billingSameAsShipping, shippingData]);
*/
  /*
  React.useEffect(() => {
    const contactDataEl = document.querySelector('.contactData');
    if (!useContact) {
      if (contactDataEl) {
        const inputContainers =
          contactDataEl.querySelectorAll('.modalInputControl');

        const selectContainers = contactDataEl.querySelectorAll(
          '.modalSelectControl',
        );

        const containers = [...inputContainers, ...selectContainers];

        const formData = contactDataEl.querySelectorAll(
          'input, textarea, select',
        );
        containers.forEach((el: Element) => {
          el.classList.remove('disabledInput');
        });
        formData.forEach((el: Element) => {
          (el as HTMLInputElement).readOnly = false;
          (el as HTMLSelectElement).disabled = false;
          (el as HTMLTextAreaElement).readOnly = false;
        });
      }
    } else {
      if (contactDataEl) {
        const inputContainers =
          contactDataEl.querySelectorAll('.modalInputControl');

        const selectContainers = contactDataEl.querySelectorAll(
          '.modalSelectControl',
        );

        const containers = [...inputContainers, ...selectContainers];

        const formData = contactDataEl.querySelectorAll(
          'input, textarea, select',
        );
        containers.forEach((el: Element) => {
          el.classList.add('disabledInput');
        });
        formData.forEach((el: Element) => {
          (el as HTMLInputElement).readOnly = true;
          (el as HTMLSelectElement).disabled = true;
          (el as HTMLTextAreaElement).readOnly = true;
        });
      }
      setShippingData({
        ...shippingData,
      });
    }
  }, [useContact]);
*/
  const checkVal = () => {
    const orderForm = document.querySelector('.orderFormContainer');
    const pageEl = orderForm?.querySelectorAll('.pageComponent');
    if (!pageEl) return;
    const inputs = pageEl[page - 1]?.querySelectorAll(
      'input[required], textarea[required], select[required]',
    );
    const errors = pageEl[page - 1]?.querySelectorAll('.errorContainer');
    if (inputs && InputValidationAll(inputs, errors)) setPage(page + 1);
  };

  React.useEffect(() => {
    document.addEventListener('keydown', (e) => {
      // if enter key is pressed but not on a checkbox or button
      if (
        e instanceof KeyboardEvent &&
        e.key === 'Enter' &&
        e.target instanceof Element &&
        e.target.tagName !== 'BUTTON' &&
        e.target.getAttribute('type') !== 'checkbox' &&
        open
      ) {
        e.preventDefault();
        checkVal();
      }
    });

    return () => {
      document.removeEventListener('keydown', (e) => {
        if (e instanceof KeyboardEvent && e.key === 'Enter' && open) {
          e.preventDefault();
          checkVal();
        }
      });
    };
  }, [page]);

  const buttonText = () => {
    if (page === 4) {
      if (width < 450) {
        return 'Submit';
      }
      return 'Submit Order';
    }
    if (page === 5) {
      return 'Close';
    }
    return 'Next';
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      wrapperTestId="orderModal"
      className={`order orderModal order${page}`}
    >
      <div className="modalHeader">
        <Headers page={page} />
      </div>
      <ModalDivider />
      <div className="contentContainer">
        <div className={`formContainer orderFormContainer step step${page}`}>
          <form>
            <Slider id="orderSlider" page={page} setPage={setPage}>
              <Devices counter={counter} setCounter={setCounter} />
              <div>
                <ModalSelectLabelFuzzy
                  selectTestDataId="selectVenueForOrderDropdown"
                  inputTestId="selectVenueForOrderDropdown"
                  labelText={'Select Venue'}
                  data={
                    (venueList &&
                      venueList.map((venue) => {
                        return {
                          name: venue.name || '',
                          id: venue.id || '',
                        };
                      })) ||
                    []
                  }
                  searchData={
                    (venueList &&
                      venueList.map((venue) => {
                        return {
                          name: venue.name || '',
                          id: venue.id || '',
                        };
                      })) ||
                    []
                  }
                  dropdownId={'selectVenueForOrderDropdown'}
                  searchKeys={['name']}
                  displayValue={'name'}
                  display={{
                    topLeft: 'name',
                    topRight: undefined,
                    bottomLeft: undefined,
                    bottomRight: undefined,
                  }}
                  displayStartLimit={5}
                  value={selectedVenue}
                  setValue={setSelectedVenue}
                  dataName={'Venues'}
                />
              </div>
              <Information
                value={shipToVenue}
                setValue={setShipToVenue}
                //contactValue={useContact}
                //setContactValue={setUseContact}
                shippingData={shippingData}
                setShippingData={setShippingData}
                //billingData={billingData}
                //setBillingData={setBillingData}
                //billingSameAsShipping={billingSameAsShipping}
                //setBillingSameAsShipping={setBillingSameAsShipping}
              />
              <CheckInformation
                counter={counter}
                shippingData={shippingData}
                //billingData={billingData}
                venueData={venueData}
              />
              <div />
            </Slider>
          </form>
        </div>
      </div>
      <ModalDivider style={{border: page === 4 ? '0' : undefined}} />
      <ModalFooterContainer>
        <div className="imageOrderProcessContainer">
          <div className={`orderProcess step${page.toString()}`}>
            <div>
              {width && width < 390 ? (
                <MemoOrderStartMini />
              ) : (
                <MemoOrderStart />
              )}
            </div>
          </div>
        </div>
        <div className="orderButtonContainer">
          {page !== 5 ? (
            <IconButton
              data-testid="backOrderButton"
              type="button"
              disabled={page === 1}
              onClick={() => {
                if (page > 1) setPage(page - 1);
              }}
              data-tooltip-id="backArrow"
              data-tooltip-content="Go Back"
              icon={<MemoBack />}
            />
          ) : null}
          <Button
            data-testid="nextOrderButton"
            onClick={() => {
              const orderForm = document.querySelector('.orderFormContainer');
              const pageEl = orderForm?.querySelectorAll('.pageComponent');
              if (!pageEl) return;
              const inputs = pageEl[page - 1]?.querySelectorAll(
                'input[required], textarea[required], select[required]',
              );
              const errors =
                pageEl[page - 1]?.querySelectorAll('.errorContainer');
              if (page < 5 && inputs && InputValidationAll(inputs, errors))
                setPage(page + 1);
              else if (page < 5 && !inputs) {
                setPage(page + 1);
              }
              if (page === 4) {
                if (typeof verifyOrderFunction !== 'undefined')
                  verifyOrderFunction();
              }
              if (page === 5) {
                setOpen(false);
              }
            }}
            type="button"
          >
            {page === 4 ? <MemoCart /> : null}
            {page === 5 ? <MemoClear /> : null}
            {page !== 4 && page !== 5 ? <MemoForward /> : null}
            {buttonText()}
          </Button>
        </div>
      </ModalFooterContainer>
    </Modal>
  );
}
