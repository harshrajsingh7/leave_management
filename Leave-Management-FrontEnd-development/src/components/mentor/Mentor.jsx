import React, { useState } from 'react'
import StudentProfilePage from './StudentProfilePage';
import MentorDashboard from './MentorDashboard';

function Mentor() {
    const [selectedStudent, setSelectedStudent] = useState(null)

    // const fetchWeekendApplicationsStudent = async () => {
    //     setIsLoading(true);
    //     try {
    //         const data = await AxiosPost('fetchWeekendOutingStudent.php', { reg_no: selectedStudent })
    //         // console.log(data)
    //         if (data.success) {
    //             setWeekendApplicationsStudent(data.weekend_applications)
    //         }
    //         else toast.error(data.error)
    //     } catch (err) {
    //         toast.error("Server Error!");
    //         console.log(err)
    //     }
    //     finally {
    //         setIsLoading(false);
    //     }
    // }

    // useEffect(() => {
    //     console.log("useEffect is running");
    //     if (selectedStudent) {
    //         console.log("Student is defined: ", selectedStudent);
    //         fetchWeekendApplicationsStudent();
    //     } else {
    //         console.log("selecteduser is null");
    //     }
    // }, [selectedStudent]);



    return (
        <>
            {selectedStudent === null ? <MentorDashboard setSelectedStudent={setSelectedStudent} /> : <StudentProfilePage selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} />}
        </>
    )
}

export default Mentor;