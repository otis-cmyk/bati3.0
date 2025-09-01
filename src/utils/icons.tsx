import { 
  Zap, Database, Globe, Mail, MessageSquare, Clock, 
  Calendar, FileText, Image, Video, Music,
  FileSpreadsheet, File, Package, Settings,
  Github, Slack, Twitter, Facebook, Instagram,
  Chrome, Smartphone, Monitor, Tablet,
  Code, Terminal, Cpu, HardDrive, Network,
  Cloud, Server, Shield, Lock, Key,
  CreditCard, DollarSign, TrendingUp, BarChart,
  Users, User, UserPlus, UserCheck,
  Search, Filter, ArrowUpDown, Layout,
  Plus, Download, Upload, Share,
  Bell, Flag, Star, Heart,
  Map, MapPin, Navigation, Compass,
  Camera, Mic, Speaker, Headphones,
  Wifi, Bluetooth, Usb, Battery,
  Home, Building, Store, Factory
} from 'lucide-react';

// Main color-based system using #1484EC
export const getServiceIcon = (iconType: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    // API & Integration
    'http': <Globe className="w-4 h-4" />,
    'api': <Zap className="w-4 h-4" />,
    'webhook': <Zap className="w-4 h-4" />,
    'rest': <Globe className="w-4 h-4" />,
    'graphql': <Code className="w-4 h-4" />,
    
    // Communication
    'email': <Mail className="w-4 h-4" />,
    'sms': <MessageSquare className="w-4 h-4" />,
    'chat': <MessageSquare className="w-4 h-4" />,
    'notification': <Bell className="w-4 h-4" />,
    
    // Data Processing
    'transform': <Settings className="w-4 h-4" />,
    'filter': <Filter className="w-4 h-4" />,
    'sort': <ArrowUpDown className="w-4 h-4" />,
    'aggregate': <BarChart className="w-4 h-4" />,
    
    // Storage
    'database': <Database className="w-4 h-4" />,
    'storage': <HardDrive className="w-4 h-4" />,
    'cache': <Cpu className="w-4 h-4" />,
    'file': <File className="w-4 h-4" />,
    
    // Social Media
    'github': <Github className="w-4 h-4" />,
    'slack': <Slack className="w-4 h-4" />,
    'twitter': <Twitter className="w-4 h-4" />,
    'facebook': <Facebook className="w-4 h-4" />,
    'instagram': <Instagram className="w-4 h-4" />,
    
    // Cloud Services
    'cloud': <Cloud className="w-4 h-4" />,
    'server': <Server className="w-4 h-4" />,
    'network': <Network className="w-4 h-4" />,
    'security': <Shield className="w-4 h-4" />,
    
    // Analytics
    'analytics': <TrendingUp className="w-4 h-4" />,
    'tracking': <Search className="w-4 h-4" />,
    'metrics': <BarChart className="w-4 h-4" />,
    
    // Time & Scheduling
    'schedule': <Clock className="w-4 h-4" />,
    'timer': <Clock className="w-4 h-4" />,
    'calendar': <Calendar className="w-4 h-4" />,
    
    // Media
    'image': <Image className="w-4 h-4" />,
    'video': <Video className="w-4 h-4" />,
    'audio': <Music className="w-4 h-4" />,
    'camera': <Camera className="w-4 h-4" />,
    
    // E-commerce
    'payment': <CreditCard className="w-4 h-4" />,
    'sales': <DollarSign className="w-4 h-4" />,
    'shop': <Store className="w-4 h-4" />,
    'inventory': <Package className="w-4 h-4" />,
    
    // User Management
    'users': <Users className="w-4 h-4" />,
    'user': <User className="w-4 h-4" />,
    'auth': <Lock className="w-4 h-4" />,
    'login': <Key className="w-4 h-4" />,
    
    // Location
    'location': <MapPin className="w-4 h-4" />,
    'map': <Map className="w-4 h-4" />,
    'navigation': <Navigation className="w-4 h-4" />,
    'gps': <Compass className="w-4 h-4" />,
    
    // Device & Platform
    'mobile': <Smartphone className="w-4 h-4" />,
    'desktop': <Monitor className="w-4 h-4" />,
    'tablet': <Tablet className="w-4 h-4" />,
    'browser': <Chrome className="w-4 h-4" />,
    
    // Connectivity
    'wifi': <Wifi className="w-4 h-4" />,
    'bluetooth': <Bluetooth className="w-4 h-4" />,
    'usb': <Usb className="w-4 h-4" />,
    'battery': <Battery className="w-4 h-4" />,
    
    // Business
    'crm': <Users className="w-4 h-4" />,
    'erp': <Building className="w-4 h-4" />,
    'hr': <UserCheck className="w-4 h-4" />,
    'finance': <DollarSign className="w-4 h-4" />,
    
    // Development
    'code': <Code className="w-4 h-4" />,
    'terminal': <Terminal className="w-4 h-4" />,
    'deploy': <Upload className="w-4 h-4" />,
    'monitor': <Monitor className="w-4 h-4" />
  };
  
  return iconMap[iconType] || <Zap className="w-4 h-4" />;
};

export const getDataIcon = (dataType: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'spreadsheet': <FileSpreadsheet className="w-4 h-4" />,
    'excel': <FileSpreadsheet className="w-4 h-4" />,
    'xlsx': <FileSpreadsheet className="w-4 h-4" />,
    'csv': <FileSpreadsheet className="w-4 h-4" />,
    'json': <FileText className="w-4 h-4" />,
    'xml': <FileText className="w-4 h-4" />,
    'txt': <FileText className="w-4 h-4" />,
    'pdf': <File className="w-4 h-4" />,
    'doc': <FileText className="w-4 h-4" />,
    'docx': <FileText className="w-4 h-4" />,
    'database': <Database className="w-4 h-4" />,
    'sql': <Database className="w-4 h-4" />,
    'image': <Image className="w-4 h-4" />,
    'video': <Video className="w-4 h-4" />,
    'audio': <Music className="w-4 h-4" />,
    'zip': <Package className="w-4 h-4" />,
    'archive': <Package className="w-4 h-4" />
  };
  
  return iconMap[dataType] || <File className="w-4 h-4" />;
};

// Clean, modern color system based on #1484EC
export const getNodeTypeColor = (type: string, category?: string) => {
  if (type === 'data') {
    // Use secondary blue tones for data
    const dataColors: Record<string, string> = {
      'spreadsheet': 'bg-[#1484EC]',
      'csv': 'bg-[#0F5BA6]', 
      'json': 'bg-[#4D9DEF]',
      'database': 'bg-[#003266]',
      'excel': 'bg-[#1484EC]',
      'file': 'bg-[#73B2F2]'
    };
    return dataColors[category || 'file'] || 'bg-[#1484EC]';
  }

  // Service node colors - all variations of main blue
  const serviceColors: Record<string, string> = {
    // Core Services - Main blue tones
    'http': 'bg-[#1484EC]',
    'api': 'bg-[#1484EC]',
    'webhook': 'bg-[#0F5BA6]',
    'database': 'bg-[#003266]',
    
    // Communication - Slightly darker
    'email': 'bg-[#0F5BA6]',
    'sms': 'bg-[#004482]',
    'notification': 'bg-[#4D9DEF]',
    
    // Processing - Mid tones
    'transform': 'bg-[#73B2F2]',
    'filter': 'bg-[#4D9DEF]',
    'analytics': 'bg-[#1484EC]',
    
    // Cloud & Storage - Darker tones
    'cloud': 'bg-[#003266]',
    'storage': 'bg-[#002F5F]',
    'server': 'bg-[#001B3A]',
    
    // Social - Lighter tones  
    'social': 'bg-[#9CC7F5]',
    'github': 'bg-[#73B2F2]',
    'slack': 'bg-[#4D9DEF]',
    
    // Default for any other service
    'default': 'bg-[#1484EC]'
  };

  return serviceColors[category || 'default'] || 'bg-[#1484EC]';
};

// Updated data asset colors to match main theme
export const getDataAssetColor = (type: string) => {
  const colors: Record<string, string> = {
    'spreadsheet': 'bg-[#1484EC]',
    'csv': 'bg-[#0F5BA6]',
    'json': 'bg-[#4D9DEF]',
    'database': 'bg-[#003266]',
    'excel': 'bg-[#1484EC]',
    'file': 'bg-[#73B2F2]'
  };
  
  return colors[type] || 'bg-[#1484EC]';
};