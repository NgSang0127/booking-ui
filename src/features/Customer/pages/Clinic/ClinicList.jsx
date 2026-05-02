import React from "react";
import ClinicCard from "./ClinicCard.jsx";

export const mockClinics = [
    {
        id: 1,
        name: "Medicare Clinic",
        address: "123 Nguyễn Thị Minh Khai",
        city: "Quận 1, TP.HCM",
        images: [
            "https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        ],
        rating: 4.8,
        description: "Phòng khám đa khoa hiện đại với đội ngũ bác sĩ giàu kinh nghiệm, chuyên khám nội khoa, nhi khoa và xét nghiệm.",
    },
    {
        id: 2,
        name: "Harmony Health Clinic",
        address: "456 Lê Văn Sỹ",
        city: "Quận 3, TP.HCM",
        images: [
            "https://images.pexels.com/photos/6129695/pexels-photo-6129695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        ],
        rating: 4.6,
        description: "Chuyên sâu về da liễu, thẩm mỹ da và laser. Không gian sang trọng, dịch vụ cao cấp.",
    },
    {
        id: 3,
        name: "CarePlus International Clinic",
        address: "789 Pasteur",
        city: "Quận 3, TP.HCM",
        images: [
            "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        ],
        rating: 4.9,
        description: "Phòng khám quốc tế với tiêu chuẩn Singapore, hỗ trợ nhiều ngôn ngữ.",
    },
    {
        id: 4,
        name: "Victoria Women's Clinic",
        address: "12 Võ Thị Sáu",
        city: "Quận Bình Thạnh, TP.HCM",
        images: [
            "https://images.pexels.com/photos/7578806/pexels-photo-7578806.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        ],
        rating: 4.7,
        description: "Chuyên khoa phụ sản và phụ khoa. Dịch vụ chăm sóc sau sinh và thẩm mỹ phụ khoa.",
    },
    {
        id: 5,
        name: "KidsFirst Pediatric Center",
        address: "67 Nguyễn Văn Trỗi",
        city: "Quận Phú Nhuận, TP.HCM",
        images: [
            "https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        ],
        rating: 4.5,
        description: "Phòng khám nhi khoa thân thiện, chuyên khám và điều trị cho trẻ em từ sơ sinh đến 16 tuổi.",
    },
];

const ClinicList = ({clinics}) => {
    const displayClinics = clinics?.length > 0 ? clinics : mockClinics;

    return (
        <div className="flex gap-5 flex-wrap">
            {displayClinics.map((item) => (
                <ClinicCard key={item.id} clinic={item}/>
            ))}
        </div>
    );
};

export default ClinicList;
