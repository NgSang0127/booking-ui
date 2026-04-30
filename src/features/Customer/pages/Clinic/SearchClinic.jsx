import React, {useState} from "react";
import {Box, InputBase, Paper, Typography} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ClinicList from "./ClinicList.jsx";
import {useSearchClinicsQuery} from "../../../../redux/Clinic/clinicApi";
import EmptyState from "../../../../components/common/EmptyState.jsx";
import LoaderManager from "../../../Loading/LoaderManager.jsx";

const SearchClinic = () => {
    const [query, setQuery] = useState("");

    // 2. Sử dụng Query Hook với logic "Skip" thông minh
    // Chỉ gọi API khi query có độ dài >= 2. Tự động lấy kết quả mới nhất khi query thay đổi.
    const {
        data: searchResults = [],
        isFetching,
        isSuccess
    } = useSearchClinicsQuery(query, {
        skip: query.trim().length < 2,
    });

    const handleSearchChange = (e) => {
        setQuery(e.target.value);
    };

    const hasResults = searchResults.length > 0;
    const isSearching = query.trim().length >= 2;

    return (
        <div className="min-h-screen bg-gray-50/50 animate-fade-in">
            {/* ── Search Header Section ── */}
            <div className="bg-white border-b border-gray-100 px-6 py-16 shadow-sm">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                            Tìm phòng khám gần bạn
                        </h1>
                        <p className="text-gray-500 font-medium text-lg">
                            Nhập tên thành phố để khám phá các phòng khám uy tín nhất
                        </p>
                    </div>

                    {/* Modern Search Bar */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: '4px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            maxWidth: 600,
                            mx: 'auto',
                            borderRadius: '99px',
                            border: '2px solid',
                            borderColor: isSearching ? 'primary.main' : '#e2e8f0',
                            boxShadow: isSearching ? '0 8px 30px rgba(0, 136, 206, 0.15)' : 'none',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <SearchIcon sx={{ ml: 1, color: isSearching ? 'primary.main' : 'text.disabled' }} />
                        <InputBase
                            sx={{ ml: 2, flex: 1, fontSize: '1.1rem', fontWeight: 500, py: 1 }}
                            placeholder="Ví dụ: Hà Nội, Hồ Chí Minh..."
                            value={query}
                            onChange={handleSearchChange}
                        />
                        {isFetching && (
                            <LoaderManager fullScreen={false}/>
                        )}
                    </Paper>

                    {/* Quick Suggestions (Optional) */}
                    <div className="flex justify-center gap-2 mt-4">
                        {["Hà Nội", "Hồ Chí Minh", "Đà Nẵng"].map(city => (
                            <button
                                key={city}
                                onClick={() => setQuery(city)}
                                className="text-xs font-bold text-gray-400 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-primary-color hover:text-white hover:border-primary-color transition-all"
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Search Results Section ── */}
            <div className="max-w-6xl mx-auto px-6 py-12">

                {/* 1. Trạng thái đang gõ nhưng chưa đủ ký tự */}
                {!isSearching && (
                    <Box textAlign="center" py={10}>
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <SearchIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                        </div>
                        <Typography variant="h6" fontWeight={700} color="text.secondary">
                            Hãy nhập ít nhất 2 ký tự để tìm kiếm
                        </Typography>
                    </Box>
                )}

                {/* 2. Trạng thái đã tìm kiếm và không có kết quả */}
                {isSearching && isSuccess && !hasResults && !isFetching && (
                    <div className="bg-white p-12 rounded-[32px] border border-gray-100 shadow-sm">
                        <EmptyState
                            icon={<LocalHospitalIcon sx={{ fontSize: 64, color: 'divider' }} />}
                            title="Không tìm thấy phòng khám"
                            description={`Chúng tôi không tìm thấy kết quả nào tại "${query}". Hãy thử tìm kiếm với tên thành phố khác.`}
                        />
                    </div>
                )}

                {/* 3. Hiển thị kết quả tìm kiếm */}
                {isSearching && hasResults && (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'gray.700' }}>
                                Tìm thấy {searchResults.length} phòng khám tại <span className="text-primary-color">{query}</span>
                            </Typography>
                        </div>
                        <div className="animate-slide-up">
                            <ClinicList clinics={searchResults} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchClinic;