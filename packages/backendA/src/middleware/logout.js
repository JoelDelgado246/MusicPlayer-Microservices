const logout = (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' }); // Borra la cookie de forma segura
    res.status(200).json({ message: 'Logout successful' });
};

export default logout;
