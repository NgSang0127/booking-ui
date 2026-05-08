import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useGetServiceByIdQuery, useUpdateServiceMutation} from "../../../../redux/ClinicService/clinicServiceApi";
import {useGetCategoriesByClinicQuery} from "../../../../redux/Category/categoryApi";
import {showSnackbar} from "../../../../redux/uiSlice";
import {uploadToCloudinary} from "../../../../util/uploadToCloudinary.js";
import LoaderManager from "../../../Loading/LoaderManager.jsx";

const UpdateServiceForm = () => {
    const [isUploading, setIsUploading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const currentClinic = useSelector((state) => state.clinic.currentClinic);

    const { data: serviceData, isLoading: isFetchingService } = useGetServiceByIdQuery(id, { skip: !id });

    const { data: categories = [] } = useGetCategoriesByClinicQuery(currentClinic?.id, { skip: !currentClinic?.id });

    const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();

    const formik = useFormik({
        initialValues: {
            name: "", description: "", price: "",
            duration: "", image: "", categoryId: "",
        },
        onSubmit: async (values) => {
            try {
                await updateService({ id, service: values }).unwrap();
                dispatch(showSnackbar({ message: "Cập nhật dịch vụ thành công!", severity: "success" }));
                setTimeout(() => navigate("/clinic-dashboard/services"), 1000);
            } catch (error) {
                dispatch(showSnackbar({ message: error?.data?.message || "Cập nhật thất bại!", severity: "error" }));
            }
        },
    });
    useEffect(() => {
        if (serviceData) {
            formik.setValues({
                name:        serviceData.name        || "",
                description: serviceData.description || "",
                price:       serviceData.price       || "",
                duration:    serviceData.duration    || "",
                image:       serviceData.image       || "",
                categoryId:  serviceData.categoryId  ?? serviceData.category?.id ?? "",
            });
        }
    }, [serviceData]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            formik.setFieldValue("image", url);
        } catch (error) {
            dispatch(showSnackbar({ message: "Lỗi tải ảnh!", severity: "error" }));
        } finally {
            setIsUploading(false);
        }
    };

    if (isFetchingService) return (
        <LoaderManager fullScreen={true}/>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <IconButton onClick={() => navigate("/clinic-dashboard/services")} sx={{ bgcolor: 'gray.50' }}>
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                    <div>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Chỉnh sửa dịch vụ</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>ID: #{id}</Typography>
                    </div>
                </div>

                <Button
                    variant="contained"
                    onClick={formik.handleSubmit}
                    disabled={isUpdating || isUploading}
                    startIcon={isUpdating ? <LoaderManager fullScreen={false} size={0.5}/> : <SaveOutlinedIcon />}
                    sx={{
                        borderRadius: '10px', px: 3, py: 1, textTransform: 'none', fontWeight: 700,
                        background: 'linear-gradient(to right, #0088ce, #00a68c)',
                        boxShadow: '0 4px 12px rgba(0, 136, 206, 0.2)'
                    }}
                >
                    Lưu thay đổi
                </Button>
            </div>

            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={4}>
                    {/* Cột trái: Ảnh và Trạng thái */}
                    <Grid item xs={12} lg={4} className="space-y-6">
                        <Box sx={{ p: 3, bgcolor: 'white', borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled', mb: 2, display: 'block', textTransform: 'uppercase' }}>
                                Ảnh đại diện
                            </Typography>

                            {formik.values.image ? (
                                <Box sx={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                                    <img src={formik.values.image} alt="Preview" className="w-full aspect-square object-cover" />
                                    <IconButton
                                        onClick={() => formik.setFieldValue("image", "")}
                                        size="small"
                                        sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.9)', color: 'error.main' }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ) : (
                                <label htmlFor="updateImg">
                                    <input type="file" id="updateImg" hidden onChange={handleImageChange} accept="image/*" />
                                    <Box sx={{
                                        aspectRatio: '1/1', border: '2px dashed', borderColor: 'divider', borderRadius: '16px',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', bgcolor: 'gray.50', transition: 'all 0.2s',
                                        '&:hover': { bgcolor: 'gray.100', borderColor: 'primary.main' }
                                    }}>
                                        {isUploading ? <LoaderManager fullScreen={false} size={0.5}/> : (
                                            <>
                                                <AddPhotoAlternateIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>Tải ảnh mới</Typography>
                                            </>
                                        )}
                                    </Box>
                                </label>
                            )}
                        </Box>

                        {/* Status Card */}
                        <Box sx={{ p: 3, bgcolor: 'white', borderRadius: '20px', border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>Trạng thái</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Hiển thị công khai</Typography>
                            </Box>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                serviceData?.available ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                               {serviceData?.available ? 'Đang hoạt động' : 'Tạm dừng'}
                           </span>
                        </Box>
                    </Grid>

                    {/* Cột phải: Form thông tin */}
                    <Grid item xs={12} lg={8} className="space-y-6">
                        <Box sx={{ p: 4, bgcolor: 'white', borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled', mb: 3, display: 'block', textTransform: 'uppercase' }}>
                                Chi tiết dịch vụ
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth label="Tên dịch vụ" name="name"
                                        value={formik.values.name} onChange={formik.handleChange}
                                        required InputLabelProps={{ shrink: true }}
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth label="Giá dịch vụ (₫)" name="price" type="number"
                                        value={formik.values.price} onChange={formik.handleChange}
                                        required InputLabelProps={{ shrink: true }}
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth label="Thời lượng (phút)" name="duration" type="number"
                                        value={formik.values.duration} onChange={formik.handleChange}
                                        required InputLabelProps={{ shrink: true }}
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl fullWidth required>
                                        <InputLabel shrink>Danh mục</InputLabel>
                                        <Select
                                            name="categoryId"
                                            value={formik.values.categoryId}
                                            onChange={formik.handleChange}
                                            label="Danh mục" notched
                                            sx={{ borderRadius: "12px" }}
                                         variant="outlined">
                                            {categories.map((cat) => (
                                                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth label="Mô tả dịch vụ" name="description"
                                        multiline rows={5}
                                        value={formik.values.description} onChange={formik.handleChange}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default UpdateServiceForm;