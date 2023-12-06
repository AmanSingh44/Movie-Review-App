import { NotificationContext } from "../context/NotificationProvider"
import { useContext } from "react"
import { ThemeContext } from "../context/ThemeProvider"
import { AuthContext } from "../context/AuthProvider"

export const useTheme = () => {
    return useContext(ThemeContext)
}

export const useNotification = () => {
    return useContext(NotificationContext)
}

export const useAuth = () => {
    return useContext(AuthContext)
}