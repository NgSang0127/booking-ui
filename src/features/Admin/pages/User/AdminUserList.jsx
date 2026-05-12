import React, {useMemo, useState} from "react";
import {useGetAllUsersQuery} from "../../../../redux/Auth/authApi";
import {
    Avatar,
    Box,
    Chip,
    InputAdornment,
    MenuItem,
    OutlinedInput,
    Pagination,
    Select,
    Skeleton,
    Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";

const ROLE_CONFIG = {
    ADMIN:    { label: "Admin",        bg: "rgba(232,51,80,0.08)",   color: "#E83350",  icon: <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 13 }} /> },
    OWNER:    { label: "Clinic Owner", bg: "rgba(0,166,140,0.08)",   color: "#00a68c",  icon: <MedicalServicesOutlinedIcon sx={{ fontSize: 13 }} /> },
    CUSTOMER: { label: "Member",       bg: "rgba(0,136,206,0.08)",   color: "#0088ce",  icon: <Person2OutlinedIcon sx={{ fontSize: 13 }} /> },
};

const RoleBadge = ({ role }) => {
    const cfg = ROLE_CONFIG[role] || { label: role, bg: "#f1f5f9", color: "#64748b", icon: null };
    return (
        <Chip
            icon={cfg.icon}
            label={cfg.label}
            size="small"
            sx={{
                fontSize: 11, fontWeight: 600, height: 22,
                bgcolor: cfg.bg, color: cfg.color, borderRadius: "6px",
                "& .MuiChip-icon": { color: cfg.color, ml: "6px" },
            }}
        />
    );
};

const StatCard = ({ label, value, icon, color, bg }) => (
    <Box sx={{
        flex: 1, px: 2.5, py: 2, borderRadius: "12px",
        bgcolor: bg, display: "flex", alignItems: "center", gap: 2,
    }}>
        <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: color + "22",
            display: "flex", alignItems: "center", justifyContent: "center", color }}>
            {icon}
        </Box>
        <Box>
            <Typography sx={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1 }}>{value}</Typography>
            <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.5 }}>{label}</Typography>
        </Box>
    </Box>
);

const PAGE_SIZE = 10;

const AdminUserList = () => {
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");

    const { data, isLoading } = useGetAllUsersQuery({ page, size: PAGE_SIZE });
    const users = data?.content || [];
    const totalPages = data?.totalPages || 1;

    const filtered = useMemo(() => {
        return users.filter((u) => {
            const matchRole = roleFilter === "ALL" || u.role === roleFilter;
            const q = search.toLowerCase();
            const matchSearch = !q || u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
            return matchRole && matchSearch;
        });
    }, [users, search, roleFilter]);

    const stats = useMemo(() => ({
        total:    users.length,
        owners:   users.filter((u) => u.role === "OWNER").length,
        members:  users.filter((u) => u.role === "CUSTOMER").length,
        admins:   users.filter((u) => u.role === "ADMIN").length,
    }), [users]);

    const getInitials = (name = "") => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    const avatarColors = ["#0088ce", "#00a68c", "#E83350", "#8b5cf6", "#f59e0b"];
    const getColor = (id) => avatarColors[(id || 0) % avatarColors.length];

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                flexWrap: "wrap", gap: 2, mb: 3 }}>
                <Box>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: "text.primary" }}>
                        User Management
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
                        {filtered.length} of {users.length} users shown
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                    <OutlinedInput
                        size="small" placeholder="Search name or email..."
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        startAdornment={<InputAdornment position="start">
                            <SearchIcon sx={{ fontSize: 17, color: "text.disabled" }} />
                        </InputAdornment>}
                        sx={{ fontSize: 13, height: 38, borderRadius: "10px", width: 220, bgcolor: "white" }}
                    />
                    <Select size="small" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
                            sx={{ fontSize: 13, height: 38, borderRadius: "10px", minWidth: 140, bgcolor: "white" }} variant="outlined">
                        <MenuItem value="ALL">All roles</MenuItem>
                        <MenuItem value="ADMIN">Admin</MenuItem>
                        <MenuItem value="OWNER">Clinic Owner</MenuItem>
                        <MenuItem value="CUSTOMER">Member</MenuItem>
                    </Select>
                </Box>
            </Box>

            {/* Stats */}
            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                <StatCard label="Total users" value={stats.total} color="#0088ce" bg="rgba(0,136,206,0.05)"
                          icon={<PeopleOutlineOutlinedIcon sx={{ fontSize: 18 }} />} />
                <StatCard label="Clinic owners" value={stats.owners} color="#00a68c" bg="rgba(0,166,140,0.05)"
                          icon={<MedicalServicesOutlinedIcon sx={{ fontSize: 18 }} />} />
                <StatCard label="Members" value={stats.members} color="#8b5cf6" bg="rgba(139,92,246,0.05)"
                          icon={<Person2OutlinedIcon sx={{ fontSize: 18 }} />} />
                <StatCard label="Admins" value={stats.admins} color="#E83350" bg="rgba(232,51,80,0.05)"
                          icon={<AdminPanelSettingsOutlinedIcon sx={{ fontSize: 18 }} />} />
            </Box>

            {/* Table */}
            <Box sx={{ bgcolor: "white", border: "0.5px solid", borderColor: "divider",
                borderRadius: "16px", overflow: "hidden" }}>
                {/* Table header */}
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 2fr 1fr 1fr",
                    px: 3, py: 1.75,
                    bgcolor: "rgba(0,0,0,0.02)",
                    borderBottom: "0.5px solid", borderColor: "divider",
                }}>
                    {["User", "Email", "Role", "ID"].map((h) => (
                        <Typography key={h} sx={{ fontSize: 11, fontWeight: 700,
                            textTransform: "uppercase", letterSpacing: "0.07em", color: "text.disabled" }}>
                            {h}
                        </Typography>
                    ))}
                </Box>

                {/* Rows */}
                <Box sx={{ "& > div:not(:last-child)": { borderBottom: "0.5px solid", borderColor: "divider" } }}>
                    {isLoading ? (
                        [...Array(6)].map((_, i) => (
                            <Box key={i} sx={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr",
                                px: 3, py: 2, alignItems: "center" }}>
                                {[...Array(4)].map((_, j) => (
                                    <Skeleton key={j} height={20} width={j === 0 ? 140 : 100} />
                                ))}
                            </Box>
                        ))
                    ) : filtered.length === 0 ? (
                        <Box sx={{ py: 10, textAlign: "center" }}>
                            <PeopleOutlineOutlinedIcon sx={{ fontSize: 36, color: "text.disabled", mb: 1 }} />
                            <Typography sx={{ color: "text.disabled", fontSize: 14 }}>No users found</Typography>
                        </Box>
                    ) : (
                        filtered.map((u) => (
                            <Box key={u.id}
                                 sx={{
                                     display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr",
                                     px: 3, py: 2, alignItems: "center",
                                     "&:hover": { bgcolor: "rgba(0,136,206,0.02)" },
                                     transition: "background 0.15s",
                                 }}
                            >
                                {/* Name + Avatar */}
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <Avatar sx={{
                                        width: 34, height: 34, borderRadius: "8px",
                                        bgcolor: getColor(u.id), fontSize: 12, fontWeight: 700,
                                    }}>
                                        {getInitials(u.fullName)}
                                    </Avatar>
                                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary" }}>
                                        {u.fullName}
                                    </Typography>
                                </Box>

                                {/* Email */}
                                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                                    {u.email}
                                </Typography>

                                {/* Role */}
                                <RoleBadge role={u.role} />

                                {/* ID */}
                                <Typography sx={{ fontSize: 12, color: "text.disabled",
                                    fontFamily: "monospace" }}>
                                    #{u.id}
                                </Typography>
                            </Box>
                        ))
                    )}
                </Box>
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Pagination
                        count={totalPages} page={page + 1}
                        onChange={(_, v) => setPage(v - 1)}
                        shape="rounded" size="small"
                        sx={{ "& .MuiPaginationItem-root": { borderRadius: "8px", fontSize: 13 } }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default AdminUserList;