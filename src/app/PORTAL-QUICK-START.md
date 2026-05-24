# Museum Portal - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Access the Portal
From the landing page (`/`), click the **"Register"** button in the University of Nueva Caceres Museum header.

### Step 2: Login
Use one of these test accounts:

| Role | Email | Experience |
|------|-------|------------|
| **General Member** | sarah@example.com | Basic membership features |
| **Researcher** | maria@example.com | Digital archives access |
| **Educator** | michael@example.com | Teaching resources |
| **Curator (Admin)** | elizabeth@example.com | Full admin dashboard |
| **Staff (Admin)** | jennifer@example.com | Operations management |

*Password: Any password works (mock system)*

### Step 3: Explore
Navigate using the sidebar to explore features based on your role!

---

## 🎯 Quick Feature Reference

### For Members (General, Researcher, Educator)

#### Navigation Menu:
- 🏠 **Dashboard** - Overview and quick actions
- 💳 **Membership & Payments** - Renew or upgrade membership
- 📅 **Events & Exhibitions** - Browse upcoming events
- 📚 **Resources** - Access role-specific materials
- 💬 **Feedback & Support** - Get help or share feedback
- ⚙️ **Settings** - Manage your account

#### Key Actions:
1. **Renew Membership**: Dashboard → "Renew Now" button
2. **Change Settings**: Settings → Choose tab → Save Changes
3. **Submit Feedback**: Feedback & Support → Fill form → Submit

---

### For Admins (Curator, Staff)

#### Navigation Menu:
- 📂 **Digital Archives** *(coming soon)*
- 📋 **Catalog** *(coming soon)*
- ✅ **Access Management** - Review applications
- 🏛️ **Museum Operations**:
  - 👥 **Manage Members** - Full member management
  - 📢 **Communication** - Send announcements
  - 📊 **Analytics and Reports** - View statistics
  - 👔 **Staff Management** *(coming soon)*
- ⚙️ **Settings** - Admin preferences

#### Key Actions:
1. **Manage Members**: Members → Search/Filter → View/Edit/Delete
2. **Send Announcement**: Communication → Compose → Preview → Send
3. **View Analytics**: Analytics → Select date range → Export report
4. **Review Applications**: Access Management → Approve/Reject

---

## 💰 Membership Pricing

| Plan | Price | Best For |
|------|-------|----------|
| **Weekly** | ₱7/week | Short-term access |
| **Monthly** | ₱30/month | *Most Popular* - Regular visitors |
| **Yearly** | ₱340/year | *Best Value* - Dedicated members |

### Payment Methods:
- 📱 GCash (QR code)
- 💳 PayPal
- 💳 Credit/Debit Card

---

## 🎨 Role Color Themes

| Role | Primary Color | Sidebar Color |
|------|---------------|---------------|
| General Public | Blue (#4A90E2) | #2d3e50 |
| Researcher | Purple (#7C3AED) | #2d3e50 |
| Educator | Green (#10B981) | #2d3e50 |
| Curator | Purple (#8B5CF6) | #2c3e50 |
| Staff | Navy (#1e3a5f) | #2c3e50 |

---

## 📊 Admin Dashboard Stats

### Current Numbers:
- **Total Members**: 1,847
- **Active**: 1,642 (88.9%)
- **Expired**: 183
- **Pending Applications**: 24
- **Monthly Revenue**: ₱55,410

---

## 🔄 Common Workflows

### Member Workflow: Purchase Membership
1. Login → Dashboard
2. Click "Renew Membership" or "Renew Now"
3. Select plan (Weekly/Monthly/Yearly)
4. Choose payment method
5. Accept terms and conditions
6. Click "Complete Payment"
7. See success confirmation

### Admin Workflow: Send Announcement
1. Login as Curator/Staff
2. Museum Operations → Communication
3. Fill in title and message
4. (Optional) Add image, event date, description
5. Select audience (All/Basic/Premium/etc.)
6. Click "Preview & Send"
7. Review preview
8. Click "Send Now"

### Admin Workflow: Manage Member
1. Museum Operations → Manage Members
2. Use search or filter to find member
3. Click 👁️ **View** to see details
4. Click ✏️ **Edit** to modify (coming soon)
5. Click 🗑️ **Delete** to remove (with confirmation)

---

## 💡 Pro Tips

### For All Users:
- ✅ Toast notifications appear in top-right for all actions
- ✅ Click your name in header to see your role
- ✅ Use "Logout" button to safely sign out
- ✅ All forms have validation - watch for error messages

### For Members:
- 📧 Email receipts are sent after payment (simulated)
- 🎫 Support tickets get reference numbers
- 📅 Membership expiry is tracked automatically
- 🏷️ Your membership status is always visible on dashboard

### For Admins:
- 🔍 Use search to quickly find members by name, email, or ID
- 📊 Export member lists to CSV/PDF/Excel
- 🎯 Target announcements to specific audience segments
- 📈 Charts update with real-time data

---

## ⚠️ Important Notes

### Mock System
- ✨ This is a **demonstration system** - no real backend
- ✨ All data is **in-memory** (resets on page refresh)
- ✨ Payments are **simulated** (no real money processed)
- ✨ Perfect for **testing and demo purposes**

### Security
- 🔒 Any password works for test accounts
- 🔒 Real implementation would require proper authentication
- 🔒 No sensitive data is stored

---

## 📱 Responsive Design

Works perfectly on:
- 📱 **Mobile** (< 768px) - Simplified layouts
- 💻 **Tablet** (768px - 1024px) - Optimized views
- 🖥️ **Desktop** (> 1024px) - Full experience

---

## 🆘 Troubleshooting

### Can't login?
- Use exact email from test accounts table
- Any password works
- Check you've selected correct role

### Page not loading?
- Check browser console for errors
- Refresh the page
- Try different browser

### Features not working?
- Some features show "coming soon" toast
- Admin features only available to Curator/Staff
- Member features hidden from admins

---

## 🎓 Learning Resources

### Component Files:
- `/components/portal/LoginRegister.tsx` - Authentication
- `/components/portal/dashboards/` - Role-specific dashboards
- `/components/portal/PaymentRenewal.tsx` - Payment system
- `/components/portal/ManageMembers.tsx` - Member management
- `/components/portal/SendAnnouncement.tsx` - Announcements

### Key Technologies:
- React Router - Navigation
- Shadcn/ui - UI components
- Recharts - Data visualization
- Sonner - Toast notifications
- Tailwind CSS - Styling

---

## ✨ Features at a Glance

✅ 5 User Roles with unique dashboards
✅ Complete authentication system
✅ Membership purchase & renewal
✅ Payment processing (3 methods)
✅ Member management (CRUD operations)
✅ Application review system
✅ Announcement composer with targeting
✅ Analytics dashboard with charts
✅ Export functionality (CSV, PDF, Excel)
✅ Settings management (5 tabs)
✅ Feedback & support system
✅ Events & exhibitions browser
✅ Resource libraries
✅ Toast notifications
✅ Fully responsive design
✅ Professional museum aesthetic

---

## 🎉 Ready to Explore!

You now have access to a complete Museum Membership Management Portal!

**Start exploring** by clicking the Register button and logging in with any test account.

Enjoy! 🏛️✨
