import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import { fetchAllEventTypes } from '../store/EventTypeSlice';
import { ReactComponent as EditIcon } from "../assets/Icons/edit_icon.svg"
import UpdateEventType from './UpdateEventType';
import { ReactComponent as View } from '../assets/Icons/View.svg';
import Modal from './Modal';


const groupByCourse = committeeMembers => {
    const groupedByCourse = committeeMembers.reduce((result, member) => {
        const courseId = member.course._id;
        if (!result[courseId]) {
            result[courseId] = {
                courseName: member.course.courseName,
                faculties: [],
            };
        }
        result[courseId].faculties.push(member);
        return result;
    }, {});
    return Object.values(groupedByCourse);
};

const ViewEventType = () => {
    const dispatch = useDispatch();
    const [dataToBeUpdated, setDataToBeUpdated] = useState({});
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const data = useSelector((state) => state.EventTypeSlice.data);
    const isDataLoading = useSelector((state) => state.EventTypeSlice.isLoading);

    const openUpdateModal = (eventType) => {
        setDataToBeUpdated(eventType);
        setIsOpenUpdateModal(true);
        console.log("called")
    }

    const closeIsOpenUpdateModal = () => {
        setIsOpenUpdateModal(false);
        dispatch(fetchAllEventTypes());
    }

    useEffect(() => {
        dispatch(fetchAllEventTypes());
    }, [dispatch]);

   


    return (
        <>
        <section className='my-2 pb-5 px-5'>
            <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 py-5 px-3 '>
                {
                    isDataLoading ?
                    Array.from({ length: 6 }, (_, idx) => ({ name: idx + 1 })).map((eventType,id)=>{
                        <EventTypeCard key={id} eventType={eventType} openUpdateModal={openUpdateModal} disabled={true}/>
                    })

                    :
                    data?.map((eventType) => (
                        <EventTypeCard key={eventType._id} eventType={eventType} openUpdateModal={openUpdateModal} />
                    ))
                }
            </section>
        </section>
            <UpdateEventType isOpen={isOpenUpdateModal} close={closeIsOpenUpdateModal} dataToBeUpdated={dataToBeUpdated}/>

        </>
    )
};


const EventTypeCard = ({ eventType ,openUpdateModal,disabled}) => {


    const [viewMembers, setViewMembers] = useState(false);

    const closeViewMembersModal = () =>{
        setViewMembers(false);
    }
    return (
        <>
        <section className="shadow-lg px-2 md:px-5 pt-5 pb-3 bg-white relative text-blue-500 h-[30vh] " >
            <img src={eventType.eventTypeLogoPath} alt="event type" srcSet={""} className='absolute opacity-10 left-0 right-0 top-0 bottom-0 w-full h-[30vh]' />
            <section className=' py-2 px-3  relative h-full'>
                <section className="flex justify-between items-center">
                    <p className='text-3xl  font-black'>{
                    disabled ?
                    <Skeleton count={1} height="50%" width="100%" baseColor="#4299e1" highlightColor="#f7fafc" duration={0.9} />
                    :
                    eventType.eventTypeName}</p>
                    <button className={`${disabled?"cursor-not-allowed":""}`} disabled={disabled}>
                        <EditIcon 
                            onClick={() => {
                                openUpdateModal(eventType)
                            }}
                        />
                    </button>
                </section>
                <section className='py-5  h-full'>
                    <section className="flex justify-between items-end gap-3 h-full pb-5">
                        <p className='text-base md:text-xl text-nowrap'>
                            {
                        disabled ?
                        <Skeleton count={1} height="50%" width="100%" baseColor="#4299e1" highlightColor="#f7fafc" duration={0.9} />
                        :
                    <> View Committee Members</>
                            }
</p>
                        <button onClick={() => { setViewMembers((old) => !old) }} className={`${disabled?"cursor-not-allowed":""}`} disabled={disabled}>
                            <View className={`h-5 w-5 `} />
                        </button>
                    </section>
                </section>
            </section>
        </section>
        <ViewCommitteeMembers  isOpen={viewMembers} close={closeViewMembersModal} eventType={eventType}/>
        </>
    );

}

const ViewCommitteeMembers = ({isOpen,close,eventType}) =>{
    return (
        <Modal isOpen={isOpen} close={close} heading={"Committee Members"}>
            <section className='grid grid-cols-1 md:grid-cols-2 gap-5 my-3'>
            {groupByCourse(eventType.committeeMembers).map((courseGroup, index) => (
                      <section key={index} className="mb-4 border border-blue-500">
                        <h3 className="text-lg px-2 py-2 font-semibold mb-2 border-b border-blue-500">{courseGroup.courseName}</h3>
                        <ul>
                          {courseGroup.faculties.map((member,mid) => (
                            <li key={member._id} className="mb-2">
                              <section className={`flex items-center ${mid===courseGroup.faculties.length-1 ? "" : "border-b "}  border-blue-500`}>
                                <section>
                                  <p className='text-center px-2'>{member.name}</p>
                                </section>
                              </section>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}

            </section>
        </Modal>
    )
}

export default ViewEventType;
