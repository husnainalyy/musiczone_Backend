import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { email, image } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { email, image },
            { new: true, runValidators: true }
        ).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}; 