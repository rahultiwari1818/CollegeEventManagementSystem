import React from 'react'
import Modal from './Modal'
import moment from 'moment'

export default function EventUpdationLog({isOpen,close,heading,updationLog}) {
  return (
    <Modal isOpen={isOpen} close={close} heading={heading}>
        <section className='px-2 py-2'>
        <section className="overflow-x-auto  overflow-y-auto border border-blue-500 border-solid rounded-t-lg">
                    <table className="table-auto min-w-full bg-white shadow-md rounded-lg overflow-hidden ">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="px-2 py-2 md:px-4 min-w-[3%]">Sr No</th>
                                <th className="px-2 py-2 md:px-4 min-w-[10%]">Change</th>
                                <th className="px-2 py-2 md:px-4 min-w-[30%]">Done By</th>
                                <th className="px-2 py-2 md:px-4 min-w-[10%]">Time</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {
                                    updationLog?.map((log, idx) => (
                                        <tr key={log.at}>
                                            <td className="border px-2 py-2 md:px-4 min-w-[3%]">{idx + 1}</td>
                                            <td className="border px-2 py-2 md:px-4 min-w-[10%]">{log.change}</td>
                                            <td className="border px-2 py-2 md:px-4 min-w-[30%]">{log.by.name}</td>
                                            <td className="border px-2 py-2 md:px-4 min-w-[10%]">{moment(log.at).format("lll")}</td>
                                            
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </table>
                </section>

        </section>
    </Modal>
  )
}
