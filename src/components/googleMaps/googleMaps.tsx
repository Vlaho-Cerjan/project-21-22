'use client';

import {
  GoogleMap,
  InfoWindow,
  LoadScriptNext,
  Marker,
  MarkerClusterer,
  OverlayView,
} from '@react-google-maps/api';
import React from 'react';
import {useWindowSize} from 'usehooks-ts';

import MemoRight from '@/src/icons/right';

import Description from '../common/description/description';
import Skeleton from '../common/skeleton/skeleton';
import Title from '../common/title/title';
import type {FakeDataWithAreaVenue} from '../networkView/network';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 39.8097343,
  lng: -98.5556199,
};

function GoogleMaps({data}: {data: FakeDataWithAreaVenue[]}) {
  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const clusterRef = React.useRef<MarkerClusterer | null>(null);
  const {width} = useWindowSize();
  const [markers, setMarkers] = React.useState<typeof data>([]);
  const [selectedCenter, setSelectedCenter] =
    React.useState<google.maps.LatLngLiteral | null>(null);

  const [selectedItem, setSelectedItem] =
    React.useState<FakeDataWithAreaVenue | null>(null);

  const [selectedCluster, setSelectedCluster] = React.useState<
    typeof data | null
  >(null);

  const initZoom = React.useMemo(() => {
    if (width < 768) return 3;
    if (width < 1200) return 4;
    return 5;
  }, [width]);

  const pinSvgString = `<svg width="26" height="26" viewBox="0 0 26 26" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <g id="Nav/RedDot">
      <g id="Oval" filter="url(#filter0_d_0_1211)">
        <circle cx="13" cy="12" r="7" fill="#FF506E"/>
        <circle cx="13" cy="12" r="8" stroke="white" stroke-width="2"/>
      </g>
    </g>
    <defs>
      <filter id="filter0_d_0_1211" x="0" y="0" width="26" height="26" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="1"/>
        <feGaussianBlur stdDeviation="2"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0235294 0 0 0 0.32 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1211"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1211" result="shape"/>
      </filter>
    </defs>
  </svg>
  `;

  React.useEffect(() => {
    if (data) {
      const markersData = data.filter(
        (item) => typeof item.coords !== 'undefined',
      );
      setMarkers(markersData);
    }
  }, [data]);

  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedCenter(null);
      }
    };

    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, []);

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
  }, []);

  React.useEffect(() => {
    if (map) {
      window.onpopstate = () => {
        if (window.location.search !== '') {
          const params = new URLSearchParams(window.location.search);
          const lat = parseFloat(params.get('lat') || '0');
          const lng = parseFloat(params.get('lng') || '0');
          const zoomParam = parseFloat(params.get('zoom') || '0');
          map.setCenter({lat, lng});
          map.setZoom(zoomParam);
        } else {
          map.setCenter(center);
          map.setZoom(initZoom);
        }
      };

      if (window.location.search !== '') {
        const params = new URLSearchParams(window.location.search);
        const lat = parseFloat(params.get('lat') || '0');
        const lng = parseFloat(params.get('lng') || '0');
        const zoomParam = parseFloat(params.get('zoom') || '0');
        map.setCenter({lat, lng});
        map.setZoom(zoomParam);
      } else {
        map.setCenter(center);
        map.setZoom(initZoom);
      }
    }
  }, [map]);

  return (
    <div className="googleMapsContainer">
      <LoadScriptNext
        id="google-map-network"
        loadingElement={<Skeleton className="absolute" />}
        googleMapsApiKey={process.env.NEXT_PUBLIC_GMAPS_MAP_API_KEY as string}
      >
        <GoogleMap
          id="google-map-network"
          mapContainerClassName="map"
          mapContainerStyle={containerStyle}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          }}
          onBoundsChanged={() => {
            if (map) {
              if ((map.getZoom() || 0) < 7) {
                setSelectedCluster(null);
              } else
                setTimeout(() => {
                  const bounds = map.getBounds();
                  const newCluster = data.filter((item) => {
                    if (
                      item &&
                      item.coords &&
                      bounds &&
                      bounds.contains(
                        new google.maps.LatLng(
                          parseFloat(item.coords.lat as string),
                          parseFloat(item.coords.lng as string),
                        ),
                      )
                    ) {
                      return item;
                    }
                    return null;
                  });

                  setSelectedCluster(newCluster);
                }, 100);
            }
          }}
          onZoomChanged={() => {}}
          onLoad={(gmap) => {
            setMap(gmap);
          }}
          onUnmount={onUnmount}
        >
          <OverlayView
            position={center}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <>
              <MarkerClusterer
                ref={clusterRef}
                onClick={() => {
                  const hdata = window.history.state;
                  setTimeout(() => {
                    const centerMap = map?.getCenter();
                    window.history.pushState(
                      hdata,
                      '',
                      `/network/devices/?lat=${centerMap?.lat()}&lng=${centerMap?.lng()}&zoom=${map?.getZoom()}`,
                    );
                  }, 100);
                }}
                clusterClass="cluster cluster-customicon"
                options={{
                  averageCenter: true,
                  gridSize: 30,
                  imagePath: '/assets/images/red-pin',
                  styles: [
                    {
                      url: '/assets/images/1x1.png',
                      width: 32,
                      height: 32,
                      className: 'cluster-customicon-1',
                    },
                    {
                      url: '/assets/images/1x1.png',
                      width: 32,
                      height: 32,
                      className: 'cluster-customicon-2',
                    },
                    {
                      url: '/assets/images/1x1.png',
                      width: 32,
                      height: 32,
                      className: 'cluster-customicon-3',
                    },
                  ],
                }}
              >
                {(clusterer) => (
                  <div>
                    {markers.map((item) => (
                      <Marker
                        data-id={item.id}
                        onClick={() => {
                          setSelectedItem(item);
                          setSelectedCenter({
                            lat: parseFloat(item.coords?.lat || '0'),
                            lng: parseFloat(item.coords?.lng || '0'),
                          });
                        }}
                        clusterer={clusterer}
                        title={item.id?.toString()}
                        key={item.deviceName + item.area + item.venue}
                        position={{
                          lat: parseFloat(item.coords?.lat || '0'),
                          lng: parseFloat(item.coords?.lng || '0'),
                        }}
                        icon={{
                          url: `data:image/svg+xml;base64,${btoa(
                            pinSvgString,
                          )}`,
                          scaledSize: new google.maps.Size(26, 26),
                        }}
                      />
                    ))}
                  </div>
                )}
              </MarkerClusterer>
              {selectedCenter ? (
                <InfoWindow
                  options={{
                    pixelOffset: new google.maps.Size(0, -13),
                  }}
                  onCloseClick={() => {
                    setSelectedCenter(null);
                  }}
                  position={{
                    lat: selectedCenter.lat,
                    lng: selectedCenter.lng,
                  }}
                >
                  <div className="info">
                    <div className="info__title">
                      Title: {selectedItem?.deviceName}
                    </div>
                  </div>
                </InfoWindow>
              ) : null}
            </>
          </OverlayView>
        </GoogleMap>
      </LoadScriptNext>
      <div className="mapOverlayItemsContainer">
        {selectedCluster
          ? selectedCluster.map((item) => (
              <button
                type="button"
                onClick={() => {
                  map?.setCenter({
                    lat: parseFloat(item.coords?.lat || '0'),
                    lng: parseFloat(item.coords?.lng || '0'),
                  });
                  map?.setZoom(15);
                  const hdata = window.history.state;
                  window.history.pushState(
                    hdata,
                    '',
                    `/network/devices/?lat=${parseFloat(
                      item.coords?.lat || '0',
                    )}&lng=${parseFloat(item.coords?.lng || '0')}&zoom=${15}`,
                  );
                }}
                key={item.id}
                className="mapItem"
              >
                <div>
                  <Title>{item.addressTitle}</Title>
                  <Description>{item.addressName}</Description>
                </div>
                <div className="rightArrowContainer">
                  <MemoRight />
                </div>
              </button>
            ))
          : null}
      </div>
    </div>
  );
}

export default React.memo(GoogleMaps);
