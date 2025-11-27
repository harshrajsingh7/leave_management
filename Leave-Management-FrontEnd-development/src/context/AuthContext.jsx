import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

const AuthContext = createContext();

// Axios instance with baseURL set
export const Axios = axios.create({ baseURL: 'http://localhost/leaveManagementAPIs/' });

// Helper functions for API requests
export const AxiosPost = async (apiname, body) => {
    try {
        const { data } = await Axios.post(apiname, body, { cache: false });
        return data;
    } catch (error) {
        console.error('Error in AxiosPost:', error);
        toast.error('Request failed!');
        throw error;
    }
}

export const AxiosGet = async (apiname) => {
    try {
        const { data } = await Axios.get(apiname);
        return data;
    } catch (error) {
        console.error('Error in AxiosGet:', error);
        toast.error('Request failed!');
        throw error;
    }
}

// Add a request interceptor to attach the token to every request
Axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);
    const navigate = useNavigate();    

    const loginUser = async ({ reg_no, password }) => {
        setLoading(true);
        try {
            const { data } = await Axios.post('login.php', { reg_no, password });
            console.log(data);
            if (data.success) {
                localStorage.setItem('accessToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.userData));
                localStorage.setItem('reg_no', data.reg_no);
                await loggedInCheck();
                setLoading(false);
                if(data.userData.privilege === 'student') {
                    navigate("/dashboard");                    
                } else if(data.userData.privilege === 'warden') {
                    navigate("/Wardendashboard");
                } else if(data.userData.privilege === 'mentor') {
                    navigate("/Mentordashboard");
                } else if(data.userData.privilege === 'admin') {
                    navigate("/dashboard")
                }
                return { Success: true };
            } else {
                toast.error(data.message || data.error || 'Login failed!');
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            return { success: false, message: 'Server Error!' };
        } finally {
            setLoading(false);
        }
    };

   

    const loggedInCheck = async () => {
        const accessToken = localStorage.getItem('accessToken');
        Axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
        try {
            if (accessToken) {
                const { data } = await Axios.get('getUser.php');
                if (data.success && data.userData) {
                    setUser({ ...data.userData, ...JSON.parse(window.localStorage.getItem("userData")) });
                } else {
                    localStorage.clear();
                    setUser(null);
                    navigate("/");
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error checking login status:", error);
            localStorage.clear();
            setUser(null);
            navigate("/");
        } finally {
            setLoading(false);
            setAuthChecked(true);
        }
    }

    useEffect(() => {
        async function asyncCall() {
            await loggedInCheck();
        }
        asyncCall();
    }, []);

    const logoutUser = () => {
        localStorage.clear();
        setUser(null);
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser, loading, authChecked }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
