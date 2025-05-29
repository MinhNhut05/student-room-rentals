const asyncHandler = require("express-async-handler");
const Room = require("../models/roomModel");

// Lấy danh sách phòng (có lọc)
const getRooms = asyncHandler(async (req, res) => {
  const {
    keyword,
    city,
    district,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    owner,
  } = req.query;

  let findQuery = {};

  // Tìm kiếm theo từ khóa
  if (keyword) {
    findQuery.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ];
  }

  // Lọc theo địa điểm
  if (city) findQuery.city = city;
  if (district) findQuery.district = district;

  // Lọc theo giá
  let priceQuery = {};
  if (minPrice) priceQuery.$gte = parseFloat(minPrice);
  if (maxPrice) priceQuery.$lte = parseFloat(maxPrice);
  if (Object.keys(priceQuery).length > 0) findQuery.price = priceQuery;

  // Lọc theo diện tích
  let areaQuery = {};
  if (minArea) areaQuery.$gte = parseFloat(minArea);
  if (maxArea) areaQuery.$lte = parseFloat(maxArea);
  if (Object.keys(areaQuery).length > 0) findQuery.area = areaQuery;

  // Lọc theo chủ phòng
  if (owner) findQuery.owner = owner;

  const rooms = await Room.find(findQuery).populate(
    "owner",
    "name email phone"
  );
  res.json(rooms);
});

// Lấy chi tiết phòng
const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id).populate(
    "owner",
    "name email _id"
  );

  if (!room) {
    res.status(404);
    throw new Error("Không tìm thấy phòng");
  }

  res.json(room);
});

// Tạo phòng mới
const createRoom = asyncHandler(async (req, res) => {
  try {
    // Xử lý ảnh upload
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => file.path || file.secure_url);
    }

    const ownerId = req.user._id;
    const {
      title,
      description,
      price,
      address,
      city,
      district,
      area,
      bedrooms,
      bathrooms,
    } = req.body;

    // Xử lý tiện nghi
    const amenities = {};
    Object.keys(req.body).forEach((key) => {
      if (key.startsWith("amenities[") && key.endsWith("]")) {
        const amenityKey = key.substring(10, key.length - 1);
        amenities[amenityKey] = req.body[key] === "true";
      }
    });

    const roomData = {
      title,
      description,
      price: Number(price),
      address,
      city,
      district: district || "",
      area: area ? Number(area) : 0,
      bedrooms: bedrooms ? Number(bedrooms) : 0,
      bathrooms: bathrooms ? Number(bathrooms) : 0,
      amenities,
      images: imageUrls,
      owner: ownerId,
    };

    const room = new Room(roomData);
    const createdRoom = await room.save();

    res.status(201).json(createdRoom);
  } catch (error) {
    res.status(500).json({ message: "Lỗi tạo phòng", error: error.message });
  }
});

// Cập nhật phòng
const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error("Không tìm thấy phòng");
  }

  if (room.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Không có quyền sửa phòng này");
  }

  const {
    title,
    description,
    price,
    address,
    city,
    district,
    area,
    bedrooms,
    bathrooms,
  } = req.body;

  // Ảnh mới upload
  const newImageUrls = req.files ? req.files.map((file) => file.path) : [];

  // Ảnh cũ còn lại
  let existingImageUrls = [];
  if (req.body.existingImages) {
    try {
      existingImageUrls = JSON.parse(req.body.existingImages);
      if (!Array.isArray(existingImageUrls)) existingImageUrls = [];
    } catch (e) {
      existingImageUrls = [];
    }
  }

  // Cập nhật dữ liệu
  room.title = title !== undefined ? title : room.title;
  room.description = description !== undefined ? description : room.description;
  room.price = price !== undefined ? Number(price) : room.price;
  room.address = address !== undefined ? address : room.address;
  room.city = city !== undefined ? city : room.city;
  room.district = district !== undefined ? district : room.district;
  room.area = area !== undefined ? Number(area) : room.area;
  room.bedrooms = bedrooms !== undefined ? Number(bedrooms) : room.bedrooms;
  room.bathrooms = bathrooms !== undefined ? Number(bathrooms) : room.bathrooms;
  room.images = [...existingImageUrls, ...newImageUrls];

  const updatedRoom = await room.save();
  res.json(updatedRoom);
});

// Xóa phòng
const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error("Không tìm thấy phòng");
  }

  if (room.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Không có quyền xóa phòng này");
  }

  await room.deleteOne();
  res.json({ message: "Đã xóa phòng" });
});

// Lấy phòng của user hiện tại
const getMyRooms = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const rooms = await Room.find({ owner: userId }).populate(
      "owner",
      "name email"
    );
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách phòng" });
  }
});

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getMyRooms,
};
