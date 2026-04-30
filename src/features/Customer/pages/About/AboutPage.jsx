import React, {useState} from "react";
import {
    Container,
    Grid,
    Typography,
    Box,
    Paper,
    Stack,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import {motion, useScroll, useTransform} from "framer-motion";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';

/* ─── DESIGN TOKENS ─────────────────────────────────────── */
const TOKEN = {
    primary: "#0EA5E9",
    primaryDark: "#0284C7",
    secondary: "#06B6D4",
    accent: "#F0F9FF",
    gold: "#F59E0B",
    surface: "#FFFFFF",
    bg: "#F0F9FF",
    text: "#0F172A",
    muted: "#64748B",
    border: "#E2E8F0",
};

/* ─── ANIMATION VARIANTS ─────────────────────────────────── */
const fadeUp = {
    hidden: {opacity: 0, y: 40},
    show: {opacity: 1, y: 0, transition: {duration: 0.7, ease: [0.22, 1, 0.36, 1]}},
};
const stagger = {
    hidden: {},
    show: {transition: {staggerChildren: 0.15}},
};

/* ─── SUB-COMPONENTS ─────────────────────────────────────── */

/** Floating decorative blob */
const Blob = ({style}) => (
    <div
        style={{
            position: "absolute",
            borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
            filter: "blur(60px)",
            opacity: 0.18,
            pointerEvents: "none",
            ...style,
        }}
    />
);

/** Pill badge */
const Badge = ({children, color = TOKEN.primary}) => (
    <span
        style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: `${color}18`,
            color,
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "6px 16px",
            borderRadius: 999,
            border: `1px solid ${color}30`,
        }}
    >
    {children}
  </span>
);

/** Stat card */
const StatCard = ({value, label, icon, delay = 0}) => (
    <motion.div variants={fadeUp} custom={delay}>
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: "20px",
                border: `1px solid ${TOKEN.border}`,
                background: TOKEN.surface,
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 20px 40px ${TOKEN.primary}15`,
                    borderColor: `${TOKEN.primary}40`,
                },
            }}
        >
            <Box
                sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "14px",
                    background: `linear-gradient(135deg, ${TOKEN.primary}20, ${TOKEN.secondary}20)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: TOKEN.primary,
                    flexShrink: 0,
                }}
            >
                {icon}
            </Box>
            <Box>
                <Typography sx={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: TOKEN.text,
                    lineHeight: 1,
                    fontFamily: "'Sora', sans-serif"
                }}>
                    {value}
                </Typography>
                <Typography sx={{fontSize: 12, color: TOKEN.muted, fontWeight: 600, mt: 0.3}}>
                    {label}
                </Typography>
            </Box>
        </Paper>
    </motion.div>
);

/** Value card */
const ValueCard = ({icon, title, desc, index}) => (
    <motion.div variants={fadeUp} style={{height: "100%"}}>
        <Paper
            elevation={0}
            sx={{
                p: "36px 32px",
                borderRadius: "28px",
                border: `1px solid ${TOKEN.border}`,
                background: TOKEN.surface,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 2,
                position: "relative",
                overflow: "hidden",
                transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
                "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: `0 24px 48px ${TOKEN.primary}18`,
                    borderColor: `${TOKEN.primary}50`,
                    "& .card-icon": {
                        background: `linear-gradient(135deg, ${TOKEN.primary}, ${TOKEN.secondary})`,
                        color: "#fff",
                    },
                },
            }}
        >
            {/* Corner number */}
            <Typography
                sx={{
                    position: "absolute",
                    top: 20,
                    right: 24,
                    fontSize: 48,
                    fontWeight: 900,
                    color: TOKEN.border,
                    lineHeight: 1,
                    fontFamily: "'Sora', sans-serif",
                    userSelect: "none",
                }}
            >
                0{index + 1}
            </Typography>

            <Box
                className="card-icon"
                sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "18px",
                    background: `${TOKEN.primary}15`,
                    color: TOKEN.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                }}
            >
                {icon}
            </Box>

            <Typography sx={{fontSize: 18, fontWeight: 700, color: TOKEN.text, fontFamily: "'Sora', sans-serif"}}>
                {title}
            </Typography>
            <Typography sx={{fontSize: 14, color: TOKEN.muted, lineHeight: 1.7}}>
                {desc}
            </Typography>
        </Paper>
    </motion.div>
);

/** Team avatar row */
const AvatarStack = () => (
    <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
        {[
            "https://i.pravatar.cc/40?img=27",
            "https://i.pravatar.cc/40?img=5",
            "https://i.pravatar.cc/40?img=12",
            "https://i.pravatar.cc/40?img=20",
        ].map((src, i) => (
            <Box
                key={i}
                component="img"
                src={src}
                sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: "2px solid white",
                    ml: i === 0 ? 0 : "-10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    objectFit: "cover",
                }}
            />
        ))}
        <Typography sx={{ml: 1.5, fontSize: 13, fontWeight: 700, color: TOKEN.muted}}>
            +10,000 bệnh nhân
        </Typography>
    </Box>
);

/* ─── MAIN PAGE ──────────────────────────────────────────── */
const AboutPage = () => {
    const [expandedFaq, setExpandedFaq] = useState(null);

    const stats = [
        {label: "Bác sĩ chuyên khoa", value: "50+", icon: <MedicalServicesIcon/>,},
        {label: "Bệnh nhân tin tưởng", value: "10K+", icon: <VerifiedUserIcon/>,},
        {label: "Năm kinh nghiệm", value: "15+", icon: <HealthAndSafetyIcon/>,},
    ];

    const values = [
        {
            title: "Trí tuệ nhân tạo",
            desc: "AI phân tích triệu chứng và gợi ý bác sĩ phù hợp nhất với tình trạng của bạn.",
            icon: <PsychologyIcon/>
        },
        {
            title: "Tốc độ tối ưu",
            desc: "Quy trình đặt lịch thông minh, hoàn thành chỉ trong vòng 30 giây với 3 bước đơn giản.",
            icon: <SpeedIcon/>
        },
        {
            title: "Bảo mật tuyệt đối",
            desc: "Dữ liệu được mã hóa đầu cuối theo tiêu chuẩn HIPAA và lưu trữ tại máy chủ nội địa.",
            icon: <SecurityIcon/>
        },
    ];

    const faqs = [
        {
            q: "ClinicBook có thu phí người dùng không?",
            a: "Hoàn toàn không. Việc đặt lịch trên hệ thống của chúng tôi là hoàn toàn miễn phí dành cho bệnh nhân. Chúng tôi chỉ thu phí từ phía phòng khám đối tác."
        },
        {
            q: "Làm sao tôi biết bác sĩ trên hệ thống là uy tín?",
            a: "Tất cả bác sĩ đều phải cung cấp chứng chỉ hành nghề hợp lệ và trải qua quy trình xác minh 3 bước nghiêm ngặt từ đội ngũ kiểm duyệt của ClinicBook."
        },
        {
            q: "Tôi có thể hủy lịch đã đặt không?",
            a: "Có, bạn có thể hủy hoặc đổi lịch trước 2 tiếng so với giờ hẹn mà không mất bất kỳ chi phí nào. Hệ thống sẽ hoàn tiền tự động trong 24 giờ."
        },
        {
            q: "ClinicBook hỗ trợ những chuyên khoa nào?",
            a: "Hiện tại chúng tôi có hơn 20 chuyên khoa bao gồm Nội khoa, Da liễu, Răng hàm mặt, Nhi khoa, Sản phụ khoa, Tim mạch và nhiều hơn nữa."
        },
    ];

    return (
        <>


            <Box
                sx={{
                    pt: {xs: "100px", md: "120px"},
                    pb: 16,
                    background: `linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 40%, #F0F9FF 100%)`,
                    minHeight: "100vh",
                    fontFamily: "'Inter', sans-serif",
                    overflow: "hidden",
                }}
            >
                <Container maxWidth="lg">

                    {/* ══════════════════════════════════════════════════
              1. HERO
          ══════════════════════════════════════════════════ */}
                    <Box sx={{position: "relative", mb: {xs: 12, md: 18}}}>
                        <Blob style={{width: 500, height: 500, background: TOKEN.primary, top: -150, right: -200}}/>
                        <Blob style={{width: 350, height: 350, background: TOKEN.secondary, bottom: -100, left: -100}}/>

                        <motion.div
                            initial="hidden"
                            animate="show"
                            variants={stagger}
                            style={{textAlign: "center", position: "relative", zIndex: 1}}
                        >
                            <motion.div variants={fadeUp}>
                                <Badge>✦ Hành trình ClinicBook</Badge>
                            </motion.div>

                            <motion.div variants={fadeUp}>
                                <Typography
                                    variant="h1"
                                    sx={{
                                        mt: 3,
                                        mb: 3,
                                        fontFamily: "'Sora', sans-serif",
                                        fontWeight: 900,
                                        fontSize: {xs: "2.6rem", md: "4.2rem", lg: "5rem"},
                                        lineHeight: 1.1,
                                        color: TOKEN.text,
                                        letterSpacing: "-0.03em",
                                    }}
                                >
                                    Định nghĩa lại cách{" "}
                                    <Box
                                        component="span"
                                        sx={{
                                            background: `linear-gradient(135deg, ${TOKEN.primary}, ${TOKEN.secondary})`,
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                        }}
                                    >
                                        Chăm sóc sức khỏe
                                    </Box>
                                </Typography>
                            </motion.div>

                            <motion.div variants={fadeUp}>
                                <Typography
                                    sx={{
                                        maxWidth: 620,
                                        mx: "auto",
                                        color: TOKEN.muted,
                                        fontSize: {xs: 16, md: 18},
                                        lineHeight: 1.8,
                                        mb: 5,
                                    }}
                                >
                                    Chúng tôi không chỉ cung cấp giải pháp đặt lịch. Chúng tôi mang đến sự an tâm
                                    và quyền lợi tối thượng cho bệnh nhân trong thời đại kỹ thuật số.
                                </Typography>
                            </motion.div>

                            <motion.div variants={fadeUp}>
                                <Box sx={{display: "flex", justifyContent: "center", mb: 6}}>
                                    <AvatarStack/>
                                </Box>
                            </motion.div>

                            {/* Stats row */}
                            <motion.div variants={stagger}>
                                <Grid container spacing={2.5} justifyContent="center"
                                      sx={{
                                          maxWidth: 900,
                                          mx: "auto"
                                      }}>
                                    {stats.map((s, i) => (
                                        <Grid item xs={12} sm={3} key={i}>
                                            <StatCard {...s} delay={i * 0.1}/>
                                        </Grid>
                                    ))}
                                </Grid>
                            </motion.div>
                        </motion.div>
                    </Box>

                    {/* ══════════════════════════════════════════════════
              2. CORE VALUES
          ══════════════════════════════════════════════════ */}
                    <Box sx={{mb: {xs: 12, md: 18}}}>
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{once: true, amount: 0.2}}
                            variants={stagger}
                        >
                            <motion.div variants={fadeUp} style={{textAlign: "center", marginBottom: 40}}>
                                <Badge color={TOKEN.secondary}>Giá trị nền tảng</Badge>
                                <Typography
                                    sx={{
                                        mt: 2,
                                        fontFamily: "'Sora', sans-serif",
                                        fontWeight: 800,
                                        fontSize: {xs: "1.8rem", md: "2.6rem"},
                                        color: TOKEN.text,
                                        letterSpacing: "-0.02em",
                                    }}
                                >
                                    Tại sao chọn ClinicBook?
                                </Typography>
                            </motion.div>

                            <Grid container spacing={3}>
                                {values.map((v, i) => (
                                    <Grid item xs={12} md={4} key={i} sx={{display: "flex"}}>
                                        <ValueCard {...v} index={i}/>
                                    </Grid>
                                ))}
                            </Grid>
                        </motion.div>
                    </Box>

                    {/* ══════════════════════════════════════════════════
              3. STORY / ABOUT
          ══════════════════════════════════════════════════ */}
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true, amount: 0.2}}
                        variants={stagger}
                    >
                        <Grid container spacing={{xs: 6, md: 10}} alignItems="center"   sx={{
                            maxWidth: 1200,
                            mx: "auto",
                            mb: { xs: 12, md: 18 }
                        }}>
                            {/* Image side */}
                            <Grid item xs={12} md={6}>
                                <motion.div variants={fadeUp}>
                                    <Box sx={{position: "relative"}}>
                                        {/* Decorative frame */}
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                inset: -12,
                                                borderRadius: "40px",
                                                background: `linear-gradient(135deg, ${TOKEN.primary}30, ${TOKEN.secondary}20)`,
                                                transform: "rotate(-2deg)",
                                                zIndex: 0,
                                            }}
                                        />
                                        <Box
                                            component="img"
                                            src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1000"
                                            alt="Bác sĩ ClinicBook"
                                            sx={{
                                                position: "relative",
                                                zIndex: 1,
                                                width: "100%",
                                                height: {xs: 320, md: 460},
                                                objectFit: "cover",
                                                borderRadius: "32px",
                                                boxShadow: `0 32px 64px ${TOKEN.primary}20`,
                                            }}
                                        />

                                        {/* Floating badge */}
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                position: "absolute",
                                                bottom: 24,
                                                right: -16,
                                                zIndex: 2,
                                                px: 3,
                                                py: 2,
                                                borderRadius: "20px",
                                                background: TOKEN.surface,
                                                border: `1px solid ${TOKEN.border}`,
                                                boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1.5,
                                            }}
                                        >
                                            <Box sx={{display: "flex", gap: 0.3}}>
                                                {[...Array(5)].map((_, i) => (
                                                    <StarIcon key={i} sx={{fontSize: 14, color: TOKEN.gold}}/>
                                                ))}
                                            </Box>
                                            <Typography sx={{fontSize: 13, fontWeight: 700, color: TOKEN.text}}>
                                                4.9 / 5 đánh giá
                                            </Typography>
                                        </Paper>

                                        {/* Floating stat */}
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                position: "absolute",
                                                top: 24,
                                                left: -16,
                                                zIndex: 2,
                                                px: 2.5,
                                                py: 1.5,
                                                borderRadius: "16px",
                                                background: `linear-gradient(135deg, ${TOKEN.primary}, ${TOKEN.secondary})`,
                                                boxShadow: `0 12px 32px ${TOKEN.primary}40`,
                                                color: "white",
                                            }}
                                        >
                                            <Typography sx={{
                                                fontSize: 22,
                                                fontWeight: 900,
                                                fontFamily: "'Sora', sans-serif",
                                                lineHeight: 1
                                            }}>
                                                24/7
                                            </Typography>
                                            <Typography sx={{fontSize: 11, fontWeight: 600, opacity: 0.85, mt: 0.3}}>
                                                Hỗ trợ kỹ thuật
                                            </Typography>
                                        </Paper>
                                    </Box>
                                </motion.div>
                            </Grid>

                            {/* Text side */}
                            <Grid item xs={12} md={6}>
                                <motion.div variants={stagger}>
                                    <motion.div variants={fadeUp}>
                                        <Badge>Câu chuyện của chúng tôi</Badge>
                                    </motion.div>

                                    <motion.div variants={fadeUp}>
                                        <Typography
                                            sx={{
                                                mt: 2,
                                                mb: 3,
                                                fontFamily: "'Sora', sans-serif",
                                                fontWeight: 800,
                                                fontSize: {xs: "1.8rem", md: "2.4rem"},
                                                color: TOKEN.text,
                                                lineHeight: 1.2,
                                                letterSpacing: "-0.02em",
                                            }}
                                        >
                                            Tiêu chuẩn vàng trong kết nối y tế
                                        </Typography>
                                    </motion.div>

                                    <motion.div variants={fadeUp}>
                                        <Box
                                            sx={{
                                                borderLeft: `4px solid ${TOKEN.primary}`,
                                                pl: 3,
                                                mb: 4,
                                                py: 0.5,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: TOKEN.muted,
                                                    fontSize: 16,
                                                    lineHeight: 1.8,
                                                    fontStyle: "italic",
                                                }}
                                            >
                                                "ClinicBook ra đời từ trăn trở về việc xếp hàng chờ đợi hàng giờ tại
                                                bệnh viện.
                                                Chúng tôi muốn mỗi phút giây của bạn đều được trân trọng."
                                            </Typography>
                                        </Box>
                                    </motion.div>

                                    <motion.div variants={fadeUp}>
                                        <Grid container spacing={3} sx={{mb: 4}}>
                                            {[
                                                {val: "99.9%", lbl: "Phản hồi tích cực"},
                                                {val: "30s", lbl: "Thời gian đặt lịch"},
                                                {val: "20+", lbl: "Chuyên khoa"},
                                                {val: "3 bước", lbl: "Xác minh bác sĩ"},
                                            ].map((s, i) => (
                                                <Grid item xs={6} key={i}>
                                                    <Box
                                                        sx={{
                                                            p: 2.5,
                                                            borderRadius: "20px",
                                                            background: `${TOKEN.primary}08`,
                                                            border: `1px solid ${TOKEN.primary}15`,
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontFamily: "'Sora', sans-serif",
                                                                fontSize: 24,
                                                                fontWeight: 900,
                                                                color: TOKEN.primary,
                                                                lineHeight: 1,
                                                            }}
                                                        >
                                                            {s.val}
                                                        </Typography>
                                                        <Typography sx={{
                                                            fontSize: 12,
                                                            color: TOKEN.muted,
                                                            fontWeight: 600,
                                                            mt: 0.5
                                                        }}>
                                                            {s.lbl}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </motion.div>

                                    <motion.div variants={fadeUp}>
                                        <button
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 8,
                                                background: `linear-gradient(135deg, ${TOKEN.primary}, ${TOKEN.secondary})`,
                                                color: "white",
                                                fontWeight: 700,
                                                fontSize: 15,
                                                padding: "14px 28px",
                                                border: "none",
                                                borderRadius: 16,
                                                cursor: "pointer",
                                                boxShadow: `0 12px 32px ${TOKEN.primary}40`,
                                                transition: "all 0.3s ease",
                                                fontFamily: "'Inter', sans-serif",
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.transform = "translateY(-2px)";
                                                e.currentTarget.style.boxShadow = `0 20px 40px ${TOKEN.primary}50`;
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = `0 12px 32px ${TOKEN.primary}40`;
                                            }}
                                        >
                                            Tìm hiểu thêm <ArrowForwardIcon fontSize="small"/>
                                        </button>
                                    </motion.div>
                                </motion.div>
                            </Grid>
                        </Grid>
                    </motion.div>

                    {/* ══════════════════════════════════════════════════
              4. FAQ
          ══════════════════════════════════════════════════ */}
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true, amount: 0.1}}
                        variants={stagger}
                    >
                        <Box sx={{maxWidth: 760, mx: "auto", mb: {xs: 12, md: 18}}}>
                            <motion.div variants={fadeUp} style={{textAlign: "center", marginBottom: 40}}>
                                <Badge color={TOKEN.gold}>Hỏi & Đáp</Badge>
                                <Typography
                                    sx={{
                                        mt: 2,
                                        fontFamily: "'Sora', sans-serif",
                                        fontWeight: 800,
                                        fontSize: {xs: "1.8rem", md: "2.4rem"},
                                        color: TOKEN.text,
                                        letterSpacing: "-0.02em",
                                    }}
                                >
                                    Giải đáp thắc mắc
                                </Typography>
                                <Typography sx={{color: TOKEN.muted, mt: 1.5, fontSize: 15}}>
                                    Những câu hỏi phổ biến nhất từ người dùng ClinicBook
                                </Typography>
                            </motion.div>

                            {faqs.map((item, index) => (
                                <motion.div key={index} variants={fadeUp}>
                                    <Accordion
                                        expanded={expandedFaq === index}
                                        onChange={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                        elevation={0}
                                        sx={{
                                            mb: 2,
                                            borderRadius: "20px !important",
                                            "&:before": {display: "none"},
                                            border: `1px solid ${expandedFaq === index ? TOKEN.primary + "50" : TOKEN.border}`,
                                            background: expandedFaq === index ? `${TOKEN.primary}05` : TOKEN.surface,
                                            transition: "all 0.3s ease",
                                            boxShadow: expandedFaq === index ? `0 8px 24px ${TOKEN.primary}12` : "none",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <AccordionSummary
                                            expandIcon={
                                                <Box
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: "10px",
                                                        background: expandedFaq === index ? `linear-gradient(135deg, ${TOKEN.primary}, ${TOKEN.secondary})` : TOKEN.border,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        transition: "all 0.3s ease",
                                                        "& svg": {color: expandedFaq === index ? "white" : TOKEN.muted},
                                                    }}
                                                >
                                                    <ExpandMoreIcon fontSize="small"/>
                                                </Box>
                                            }
                                            sx={{py: 0.5, px: 3}}
                                        >
                                            <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                                                <Typography
                                                    sx={{
                                                        fontFamily: "'Sora', sans-serif",
                                                        fontWeight: 700,
                                                        fontSize: 15,
                                                        color: expandedFaq === index ? TOKEN.primary : TOKEN.text,
                                                        py: 1,
                                                        transition: "color 0.3s",
                                                    }}
                                                >
                                                    {item.q}
                                                </Typography>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{px: 3, pb: 2.5}}>
                                            <Typography sx={{color: TOKEN.muted, lineHeight: 1.8, fontSize: 14}}>
                                                {item.a}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </motion.div>
                            ))}
                        </Box>
                    </motion.div>

                    {/* ══════════════════════════════════════════════════
              5. CTA BANNER
          ══════════════════════════════════════════════════ */}
                    <motion.div
                        initial={{opacity: 0, y: 40}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.8, ease: [0.22, 1, 0.36, 1]}}
                    >
                        <Box
                            sx={{
                                borderRadius: "40px",
                                background: `linear-gradient(135deg, ${TOKEN.primaryDark} 0%, ${TOKEN.primary} 50%, ${TOKEN.secondary} 100%)`,
                                p: {xs: "48px 28px", md: "72px 80px"},
                                textAlign: "center",
                                position: "relative",
                                overflow: "hidden",
                                boxShadow: `0 40px 80px ${TOKEN.primary}35`,
                            }}
                        >
                            {/* Decorative circles */}
                            <Box sx={{
                                position: "absolute",
                                top: -80,
                                right: -80,
                                width: 300,
                                height: 300,
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.06)"
                            }}/>
                            <Box sx={{
                                position: "absolute",
                                bottom: -60,
                                left: -60,
                                width: 250,
                                height: 250,
                                borderRadius: "50%",
                                background: "rgba(0,0,0,0.08)"
                            }}/>
                            <Box sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%,-50%)",
                                width: 500,
                                height: 500,
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.03)"
                            }}/>

                            <Box sx={{position: "relative", zIndex: 1}}>
                                <Typography
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 1,
                                        background: "rgba(255,255,255,0.15)",
                                        color: "rgba(255,255,255,0.9)",
                                        fontSize: 12,
                                        fontWeight: 700,
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                        px: 2.5,
                                        py: 1,
                                        borderRadius: 999,
                                        mb: 3,
                                        border: "1px solid rgba(255,255,255,0.2)",
                                    }}
                                >
                                    ✦ Bắt đầu ngay hôm nay
                                </Typography>

                                <Typography
                                    sx={{
                                        fontFamily: "'Sora', sans-serif",
                                        fontWeight: 900,
                                        fontSize: {xs: "1.8rem", md: "3rem"},
                                        color: "white",
                                        mb: 2,
                                        lineHeight: 1.15,
                                        letterSpacing: "-0.02em",
                                    }}
                                >
                                    Sẵn sàng trải nghiệm y tế 4.0?
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "rgba(255,255,255,0.75)",
                                        fontSize: {xs: 15, md: 17},
                                        mb: 5,
                                        maxWidth: 520,
                                        mx: "auto",
                                        lineHeight: 1.7,
                                    }}
                                >
                                    Đồng hành cùng hàng ngàn người dùng đã thay đổi cách khám bệnh.
                                    Đặt lịch ngay hôm nay — hoàn toàn miễn phí!
                                </Typography>

                                <Stack direction={{xs: "column", sm: "row"}} spacing={2} justifyContent="center">
                                    <button
                                        style={{
                                            padding: "16px 36px",
                                            background: "white",
                                            color: TOKEN.primaryDark,
                                            fontWeight: 800,
                                            fontSize: 15,
                                            border: "none",
                                            borderRadius: 16,
                                            cursor: "pointer",
                                            fontFamily: "'Sora', sans-serif",
                                            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                                            transition: "all 0.3s ease",
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = "translateY(0) scale(1)";
                                        }}
                                    >
                                        Đặt lịch ngay →
                                    </button>
                                    <button
                                        style={{
                                            padding: "16px 36px",
                                            background: "transparent",
                                            color: "white",
                                            fontWeight: 700,
                                            fontSize: 15,
                                            border: "2px solid rgba(255,255,255,0.4)",
                                            borderRadius: 16,
                                            cursor: "pointer",
                                            fontFamily: "'Inter', sans-serif",
                                            transition: "all 0.3s ease",
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)";
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = "transparent";
                                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                                        }}
                                    >
                                        Xem danh sách bác sĩ
                                    </button>
                                </Stack>
                            </Box>
                        </Box>
                    </motion.div>

                </Container>
            </Box>
        </>
    );
};

export default AboutPage;